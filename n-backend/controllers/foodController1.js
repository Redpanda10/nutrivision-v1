const mongoose = require("mongoose");
const foodModel = require("../models/foodModel");
const User = require("../models/userModel");
const { runYOLO } = require("../ai/yoloService");
const nutritionDB = require("./nutritionDB"); // ← local nutrition database

const fs = require("fs");
const path = require("path");

/* =========================
   HELPERS
========================= */

const n = (v) => Number(v || 0);

const emptyNutrition = {
  caloriesKcal: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
  sugarG: 0,
};

const calculateTotals = (entries = []) => {
  return entries.reduce(
    (acc, item) => {
      acc.caloriesKcal += n(item.nutrition?.caloriesKcal);
      acc.proteinG     += n(item.nutrition?.proteinG);
      acc.carbsG       += n(item.nutrition?.carbsG);
      acc.fatG         += n(item.nutrition?.fatG);
      acc.sugarG       += n(item.nutrition?.sugarG);
      return acc;
    },
    { ...emptyNutrition }
  );
};

const getDateFilter = (filter) => {
  const now   = new Date();
  const start = new Date();

  if (filter === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (filter === "week") {
    start.setDate(now.getDate() - 7);
  } else if (filter === "month") {
    start.setMonth(now.getMonth() - 1);
  } else {
    return null;
  }

  return start;
};

/* =========================
   LOCAL NUTRITION LOOKUP
   Replaces USDA API call.
   Normalises the detected label → looks it up in nutritionDB.js
========================= */

const fetchNutrition = (foodName) => {
  // Normalise: trim + convert spaces/hyphens to underscores to match DB keys
  // e.g. "butter naan" → "Butter_naan", "bell pepper" → "bell_pepper"
  const normalised = String(foodName)
    .trim()
    .replace(/[\s-]+/g, "_");

  // Try exact key first, then Title-cased key (for Nepali dishes stored as "Bhat", "Daal" etc.)
  const entry =
    nutritionDB[normalised] ||
    nutritionDB[normalised.charAt(0).toUpperCase() + normalised.slice(1)];

  if (entry) return entry;

  // Not found → return zeros so the app never crashes
  console.warn(`[nutritionDB] No entry for "${foodName}" (tried key: "${normalised}")`);
  return emptyNutrition;
};

const { GoogleGenAI } = require("@google/genai");

// Initialize with your Gemini API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const fetchDescription = async (foodName) => {
  try {
    let aiDescription = "Description not available right now will be updated soon.";
    
    // Initialize the model
    const model = "gemini-3.1-flash-lite"; 

    const prompt = `You are an expert in Nepali cuisine. Write a simple description for ${foodName}. 
            Include: Ingredients (if any), taste, cultural importance, how it's eaten, one fact, and in simple words.
            If you are unaware of the food then simply say 'I currently do not have more information about this food.'`;

    // Generate content
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 300, // Increased from 50 to allow for the full description requested
        temperature: 0.7,
      },
    });

    // Gemini returns text via the .text property
    const Description = response.candidates?.[0]?.content?.parts?.[0]?.text;;

    return Description || aiDescription;

  } catch (error) {
    console.log("Description Error:", error.message);
    return null;
  }
};


/* =========================
   SAFETY CHECK
========================= */

const buildSafetyCheck = (user, ingredients = []) => {
  const allergies = user?.healthProfile?.allergies?.length
    ? user.healthProfile.allergies
    : user?.allergies || [];

  const lowerAllergies = allergies.map((a) => String(a).toLowerCase());
  const matched = [];

  ingredients.forEach((ing) => {
    const lowerIng = String(ing).toLowerCase();
    lowerAllergies.forEach((allergy) => {
      if (lowerIng.includes(allergy)) matched.push(allergy);
    });
  });

  const uniqueMatched = [...new Set(matched)];

  return {
    isSafe:           uniqueMatched.length === 0,
    allergensMatched: uniqueMatched,
    warnings:         uniqueMatched.length > 0
      ? [`Contains: ${uniqueMatched.join(", ")}`]
      : [],
  };
};

/* =========================
   SCAN FOOD
========================= */
exports.scanFood = async (req, res) => {
  let uploadedFilePath;

  try {
    // =========================
    // AUTH CHECK
    // =========================

    if (!req.user?.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // =========================
    // IMAGE CHECK
    // =========================

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    uploadedFilePath = path.resolve(req.file.path);

    // =========================
    // USER FETCH
    // =========================

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =========================
    // YOLO DETECTION
    // =========================

    const aiResult = await runYOLO(uploadedFilePath);

    const detections = Array.isArray(aiResult)
      ? aiResult
      : aiResult?.detections || [];

    if (!detections.length) {
      return res.status(200).json({
        success: false,
        detectedFoods: [],
      });
    }

    // =========================
    // REMOVE DUPLICATES
    // =========================

    const uniqueFoods = [
      ...new Set(
        detections
          .map((d) => d.name)
          .filter(Boolean)
      ),
    ];

    console.log("Detected foods:", uniqueFoods);

    // =========================
    // BUILD RESPONSE
    // =========================

    const detectedFoods = await Promise.all(
      uniqueFoods.map(async (food, index) => {
        const match = detections.find(
          (d) => d.name === food
        );

        // Fetch nutrition + description in parallel
        const [nutrition, description] =
          await Promise.all([
            fetchNutrition(food),
            fetchDescription(food),
          ]);

        return {
          id: index + 1,

          name: food,

          confidence: match?.confidence
            ? Number(
                (match.confidence * 100).toFixed(1)
              )
            : 0,

          nutrition:
            nutrition || emptyNutrition,

          description:
            description ||
            "No description available.",

          safetyCheck: buildSafetyCheck(
            user,
            [food]
          ),
        };
      })
    );

    return res.status(200).json({
      success: true,

      detectedFoods,

      annotatedImage: aiResult?.annotatedImage
        ? `data:image/jpeg;base64,${aiResult.annotatedImage}`
        : null,
    });

  } catch (error) {

    console.error("SCAN ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  } finally {

    // =========================
    // DELETE TEMP FILE
    // =========================

    if (
      uploadedFilePath &&
      fs.existsSync(uploadedFilePath)
    ) {
      fs.unlinkSync(uploadedFilePath);
    }
  }
};

/* =========================
   SAVE MEAL
========================= */

exports.saveMeal = async (req, res) => {
  try {
    const { selectedFoods, totals, annotatedImage } = req.body;

    if (!Array.isArray(selectedFoods) || !selectedFoods.length) {
      return res.status(400).json({ message: "No foods selected" });
    }

    const meal = await foodModel.create({
      user: req.user.id,

      recognition: {
        name:           "Custom Meal",
        confidence:     100,
        provider:       "frontend",
        annotatedImage,
      },

      ingredients: selectedFoods.map((f) => f.name),
      nutrition:   totals || emptyNutrition,
      selectedFoods,
      eatenAt:     new Date(),
    });

    return res.status(201).json({ success: true, meal });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save meal", error: error.message });
  }
};

/* =========================
   TODAY'S SUMMARY
========================= */

exports.getTodaySummary = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const entries = await foodModel.find({
      user:    req.user.id,
      eatenAt: { $gte: start },
    });

    return res.status(200).json({
      success: true,
      totals:  calculateTotals(entries),
      count:   entries.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching today summary", error: error.message });
  }
};

/* =========================
   HISTORY LIST
========================= */

exports.getHistory = async (req, res) => {
  try {
    const { filter = "all" } = req.query;
    const startDate = getDateFilter(filter);

    const query = { user: req.user.id };
    if (startDate) query.eatenAt = { $gte: startDate };

    const items = await foodModel
      .find(query)
      .select("_id recognition nutrition eatenAt createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = items.map((item) => ({
      id:             item._id,
      name:           item.recognition?.name || "Meal",
      calories:       item.nutrition?.caloriesKcal || 0,
      annotatedImage: item.recognition?.annotatedImage || null,
      eatenAt:        item.eatenAt,
    }));

    return res.status(200).json({ success: true, items: formatted });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching history", error: error.message });
  }
};

/* =========================
   FOOD DETAILS
========================= */

exports.getHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const item = await foodModel
      .findOne({ _id: id, user: req.user.id })
      .lean();

    if (!item) return res.status(404).json({ message: "Meal not found" });

    return res.status(200).json({ success: true, item });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching item", error: error.message });
  }
};

/* =========================
   PERIOD SUMMARY
========================= */

exports.getPeriodSummary = async (req, res) => {
  try {
    const { range = "week" } = req.query;
    const startDate = getDateFilter(range);

    const entries = await foodModel.find({
      user:    req.user.id,
      eatenAt: { $gte: startDate },
    });

    return res.status(200).json({
      success: true,
      range,
      totals:  calculateTotals(entries),
      count:   entries.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error generating summary", error: error.message });
  }
};

/* =========================
   WEEKLY INSIGHTS
========================= */

exports.getWeeklyInsights = async (req, res) => {
  try {
    const startDate = getDateFilter("week");

    const entries = await foodModel.find({
      user:    req.user.id,
      eatenAt: { $gte: startDate },
    });

    const totals   = calculateTotals(entries);
    const insights = [];

    if (totals.proteinG     <  300)  insights.push("Low protein intake this week.");
    if (totals.caloriesKcal > 14000) insights.push("High calorie intake this week.");
    if (totals.sugarG       >  350)  insights.push("High sugar intake this week.");
    if (!insights.length)            insights.push("Balanced nutrition this week 👏");

    return res.status(200).json({ success: true, totals, insights });
  } catch (error) {
    return res.status(500).json({ message: "Error generating insights", error: error.message });
  }
};

/* =========================
   UPDATE MEAL
========================= */

exports.updateHistoryItem = async (req, res) => {
  try {
    const item = await foodModel.findOne({
      _id:  req.params.id,
      user: req.user.id,
    });

    if (!item) return res.status(404).json({ message: "Meal not found" });

    Object.assign(item.nutrition, req.body);
    await item.save();

    return res.status(200).json({ success: true, item });
  } catch (error) {
    return res.status(500).json({ message: "Update failed", error: error.message });
  }
};

/* =========================
   DELETE MEAL
========================= */

exports.deleteHistoryItem = async (req, res) => {
  try {
    const deleted = await foodModel.findOneAndDelete({
      _id:  req.params.id,
      user: req.user.id,
    });

    if (!deleted) return res.status(404).json({ message: "Meal not found" });

    return res.status(200).json({ success: true, message: "Meal deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
