// const mongoose = require("mongoose");
// const foodModel = require("../models/foodModel");
// const User = require("../models/userModel");
// const { runYOLO } = require("../ai/yoloService");

// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");

// /* =========================
//    USDA CONFIG
// ========================= */

// const USDA_API_KEY = process.env.USDA_API_KEY;

// const USDA_BASE_URL =
//   "https://api.nal.usda.gov/fdc/v1/foods/search";

// /* =========================
//    HELPERS
// ========================= */

// const n = (v) => Number(v || 0);

// const emptyNutrition = {
//   caloriesKcal: 0,
//   proteinG: 0,
//   carbsG: 0,
//   fatG: 0,
//   sugarG: 0,
// };

// const calculateTotals = (entries = []) => {
//   return entries.reduce(
//     (acc, item) => {
//       acc.caloriesKcal += n(item.nutrition?.caloriesKcal);
//       acc.proteinG += n(item.nutrition?.proteinG);
//       acc.carbsG += n(item.nutrition?.carbsG);
//       acc.fatG += n(item.nutrition?.fatG);
//       acc.sugarG += n(item.nutrition?.sugarG);

//       return acc;
//     },
//     { ...emptyNutrition }
//   );
// };

// const getDateFilter = (filter) => {
//   const now = new Date();
//   const start = new Date();

//   if (filter === "today") {
//     start.setHours(0, 0, 0, 0);
//   } else if (filter === "week") {
//     start.setDate(now.getDate() - 7);
//   } else if (filter === "month") {
//     start.setMonth(now.getMonth() - 1);
//   } else {
//     return null;
//   }

//   return start;
// };

// /* =========================
//    SAFETY CHECK
// ========================= */

// const buildSafetyCheck = (user, ingredients = []) => {
//   const allergies =
//     user?.healthProfile?.allergies?.length
//       ? user.healthProfile.allergies
//       : user?.allergies || [];

//   const lowerAllergies = allergies.map((a) =>
//     String(a).toLowerCase()
//   );

//   const matched = [];

//   ingredients.forEach((ing) => {
//     const lowerIng = String(ing).toLowerCase();

//     lowerAllergies.forEach((allergy) => {
//       if (lowerIng.includes(allergy)) {
//         matched.push(allergy);
//       }
//     });
//   });

//   const uniqueMatched = [...new Set(matched)];

//   return {
//     isSafe: uniqueMatched.length === 0,
//     allergensMatched: uniqueMatched,
//     warnings:
//       uniqueMatched.length > 0
//         ? [`Contains: ${uniqueMatched.join(", ")}`]
//         : [],
//   };
// };

// /* =========================
//    USDA FETCH
// ========================= */

// const cleanQuery = (name) =>
//   `${String(name).toLowerCase().trim()} raw`;

// const fetchNutrition = async (foodName) => {
//   try {
//     const res = await axios.get(USDA_BASE_URL, {
//       params: {
//         api_key: USDA_API_KEY,
//         query: cleanQuery(foodName),
//         pageSize: 5,
//       },
//     });

//     const food = res.data?.foods?.[0];

//     if (!food) return null;

//     const nutrients = food.foodNutrients || [];

//     const get = (id) =>
//       nutrients.find(
//         (n) =>
//           Number(n.nutrientId) === Number(id) ||
//           Number(n.nutrient?.id) === Number(id)
//       );

//     return {
//       caloriesKcal: get(1008)?.value || 0,
//       proteinG: get(1003)?.value || 0,
//       carbsG: get(1005)?.value || 0,
//       fatG: get(1004)?.value || 0,
//       sugarG: get(2000)?.value || 0,
//     };
//   } catch (err) {
//     console.log("USDA ERROR:", err.message);
//     return null;
//   }
// };

// /* =========================
//    SCAN FOOD
// ========================= */

// exports.scanFood = async (req, res) => {
//   let uploadedFilePath;

//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({
//         message: "Unauthorized",
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         message: "No image uploaded",
//       });
//     }

//     uploadedFilePath = path.resolve(req.file.path);

//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const aiResult = await runYOLO(uploadedFilePath);

//     const detections = Array.isArray(aiResult)
//       ? aiResult
//       : aiResult?.detections ||
//         aiResult?.results ||
//         aiResult?.predictions ||
//         [];

//     if (!detections.length) {
//       return res.status(200).json({
//         success: false,
//         detectedFoods: [],
//       });
//     }

//     const uniqueFoods = [
//       ...new Set(
//         detections.map((d) => d.name).filter(Boolean)
//       ),
//     ];

//     const detectedFoods = await Promise.all(
//       uniqueFoods.map(async (food, index) => {
//         const match = detections.find(
//           (d) => d.name === food
//         );

//         const nutrition =
//           (await fetchNutrition(food)) ||
//           emptyNutrition;

//         return {
//           id: index + 1,
//           name: food,

//           confidence: match?.confidence
//             ? Number(
//                 (match.confidence * 100).toFixed(1)
//               )
//             : 0,

//           nutrition,

//           safetyCheck: buildSafetyCheck(user, [
//             food,
//           ]),
//         };
//       })
//     );

//     return res.status(200).json({
//       success: true,
//       detectedFoods,

//       annotatedImage: aiResult?.annotatedImage
//         ? `data:image/jpeg;base64,${aiResult.annotatedImage}`
//         : null,
//     });
//   } catch (error) {
//     console.log("SCAN ERROR:", error);

//     return res.status(500).json({
//       message: "Server Error",
//       error: error.message,
//     });
//   } finally {
//     if (
//       uploadedFilePath &&
//       fs.existsSync(uploadedFilePath)
//     ) {
//       fs.unlinkSync(uploadedFilePath);
//     }
//   }
// };

// /* =========================
//    SAVE MEAL
// ========================= */

// exports.saveMeal = async (req, res) => {
//   try {
//     const {
//       selectedFoods,
//       totals,
//       annotatedImage,
//     } = req.body;

//     if (
//       !Array.isArray(selectedFoods) ||
//       !selectedFoods.length
//     ) {
//       return res.status(400).json({
//         message: "No foods selected",
//       });
//     }

//     const meal = await foodModel.create({
//       user: req.user.id,

//       recognition: {
//         name: "Custom Meal",
//         confidence: 100,
//         provider: "frontend",
//         annotatedImage,
//       },

//       ingredients: selectedFoods.map(
//         (f) => f.name
//       ),

//       nutrition: totals || emptyNutrition,

//       selectedFoods,

//       eatenAt: new Date(),
//     });

//     return res.status(201).json({
//       success: true,
//       meal,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to save meal",
//       error: error.message,
//     });
//   }
// };

// /* =========================
//    HISTORY LIST
// ========================= */

// exports.getTodaySummary = async (req, res) => {
//   try {
//     const start = new Date();
//     start.setHours(0, 0, 0, 0);

//     const entries = await foodModel.find({
//       user: req.user.id,
//       eatenAt: { $gte: start },
//     });

//     const totals = calculateTotals(entries);

//     return res.status(200).json({
//       success: true,
//       totals,
//       count: entries.length,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error fetching today summary",
//       error: error.message,
//     });
//   }
// };


// exports.getHistory = async (req, res) => {
//   try {
//     const { filter = "all" } = req.query;

//     const startDate = getDateFilter(filter);

//     const query = {
//       user: req.user.id,
//     };

//     if (startDate) {
//       query.eatenAt = {
//         $gte: startDate,
//       };
//     }

//     const items = await foodModel
//       .find(query)
//       .select(
//         "_id recognition nutrition eatenAt createdAt"
//       )
//       .sort({ createdAt: -1 })
//       .lean();

//     const formatted = items.map((item) => ({
//       id: item._id,

//       name:
//         item.recognition?.name || "Meal",

//       calories:
//         item.nutrition?.caloriesKcal || 0,

//       annotatedImage:
//         item.recognition?.annotatedImage || null,

//       eatenAt: item.eatenAt,
//     }));

//     return res.status(200).json({
//       success: true,
//       items: formatted,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error fetching history",
//       error: error.message,
//     });
//   }
// };

// /* =========================
//    FOOD DETAILS
// ========================= */

// exports.getHistoryItem = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         message: "Invalid ID",
//       });
//     }

//     const item = await foodModel
//       .findOne({
//         _id: id,
//         user: req.user.id,
//       })
//       .lean();

//     if (!item) {
//       return res.status(404).json({
//         message: "Meal not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       item,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error fetching item",
//       error: error.message,
//     });
//   }
// };

// /* =========================
//    SUMMARY
// ========================= */

// exports.getPeriodSummary = async (req, res) => {
//   try {
//     const { range = "week" } = req.query;

//     const startDate = getDateFilter(range);

//     const entries = await foodModel.find({
//       user: req.user.id,
//       eatenAt: {
//         $gte: startDate,
//       },
//     });

//     const totals = calculateTotals(entries);

//     return res.status(200).json({
//       success: true,
//       range,
//       totals,
//       count: entries.length,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error generating summary",
//       error: error.message,
//     });
//   }
// };

// /* =========================
//    WEEKLY INSIGHTS
// ========================= */

// exports.getWeeklyInsights = async (
//   req,
//   res
// ) => {
//   try {
//     const startDate = getDateFilter("week");

//     const entries = await foodModel.find({
//       user: req.user.id,
//       eatenAt: {
//         $gte: startDate,
//       },
//     });

//     const totals = calculateTotals(entries);

//     const insights = [];

//     if (totals.proteinG < 300) {
//       insights.push(
//         "Low protein intake this week."
//       );
//     }

//     if (totals.caloriesKcal > 14000) {
//       insights.push(
//         "High calorie intake this week."
//       );
//     }

//     if (totals.sugarG > 350) {
//       insights.push(
//         "High sugar intake this week."
//       );
//     }

//     if (!insights.length) {
//       insights.push(
//         "Balanced nutrition this week 👏"
//       );
//     }

//     return res.status(200).json({
//       success: true,
//       totals,
//       insights,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error generating insights",
//       error: error.message,
//     });
//   }
// };

// /* =========================
//    UPDATE MEAL
// ========================= */

// exports.updateHistoryItem = async (
//   req,
//   res
// ) => {
//   try {
//     const item = await foodModel.findOne({
//       _id: req.params.id,
//       user: req.user.id,
//     });

//     if (!item) {
//       return res.status(404).json({
//         message: "Meal not found",
//       });
//     }

//     Object.assign(
//       item.nutrition,
//       req.body
//     );

//     await item.save();

//     return res.status(200).json({
//       success: true,
//       item,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Update failed",
//       error: error.message,
//     });
//   }
// };

// /* =========================
//    DELETE MEAL
// ========================= */

// exports.deleteHistoryItem = async (
//   req,
//   res
// ) => {
//   try {
//     const deleted =
//       await foodModel.findOneAndDelete({
//         _id: req.params.id,
//         user: req.user.id,
//       });

//     if (!deleted) {
//       return res.status(404).json({
//         message: "Meal not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Meal deleted",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Delete failed",
//       error: error.message,
//     });
//   }
// };











const mongoose = require("mongoose");
const foodModel = require("../models/foodModel");
const User = require("../models/userModel");
const { runYOLO } = require("../ai/yoloService");

const axios = require("axios");
const fs = require("fs");
const path = require("path");

/* =========================
   USDA CONFIG
========================= */

const USDA_API_KEY = process.env.USDA_API_KEY;

const USDA_BASE_URL =
  "https://api.nal.usda.gov/fdc/v1/foods/search";

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
      acc.proteinG += n(item.nutrition?.proteinG);
      acc.carbsG += n(item.nutrition?.carbsG);
      acc.fatG += n(item.nutrition?.fatG);
      acc.sugarG += n(item.nutrition?.sugarG);

      return acc;
    },
    { ...emptyNutrition }
  );
};

const getDateFilter = (filter) => {
  const now = new Date();
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
   SAFETY CHECK
========================= */

const buildSafetyCheck = (user, ingredients = []) => {
  const allergies =
    user?.healthProfile?.allergies?.length
      ? user.healthProfile.allergies
      : user?.allergies || [];

  const lowerAllergies = allergies.map((a) =>
    String(a).toLowerCase()
  );

  const matched = [];

  ingredients.forEach((ing) => {
    const lowerIng = String(ing).toLowerCase();

    lowerAllergies.forEach((allergy) => {
      if (lowerIng.includes(allergy)) {
        matched.push(allergy);
      }
    });
  });

  const uniqueMatched = [...new Set(matched)];

  return {
    isSafe: uniqueMatched.length === 0,
    allergensMatched: uniqueMatched,
    warnings:
      uniqueMatched.length > 0
        ? [`Contains: ${uniqueMatched.join(", ")}`]
        : [],
  };
};

/* =========================
   USDA FETCH
========================= */

const cleanQuery = (name) =>
  `${String(name).toLowerCase().trim()} raw`;

const fetchNutrition = async (foodName) => {
  try {
    const res = await axios.get(USDA_BASE_URL, {
      params: {
        api_key: USDA_API_KEY,
        query: cleanQuery(foodName),
        pageSize: 5,
      },
    });

    const food = res.data?.foods?.[0];

    if (!food) return null;

    const nutrients = food.foodNutrients || [];

    const get = (id) =>
      nutrients.find(
        (n) =>
          Number(n.nutrientId) === Number(id) ||
          Number(n.nutrient?.id) === Number(id)
      );

    return {
      caloriesKcal: get(1008)?.value || 0,
      proteinG: get(1003)?.value || 0,
      carbsG: get(1005)?.value || 0,
      fatG: get(1004)?.value || 0,
      sugarG: get(2000)?.value || 0,
    };
  } catch (err) {
    console.log("USDA ERROR:", err.message);
    return null;
  }
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
   SCAN FOOD
========================= */

exports.scanFood = async (req, res) => {

  const requestone = req.body;

  console.log(requestone);

  let uploadedFilePath;

  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
      
    }
    

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    uploadedFilePath = path.resolve(req.file.path);


    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const aiResult = await runYOLO(uploadedFilePath);

    // console.log(aiResult)
    console.log(aiResult.foods)

    const detections = Array.isArray(aiResult)
      ? aiResult
      : aiResult?.detections ||
        // aiResult?.results ||
        // aiResult?.predictions ||
        [];

        // detections = [
//   { name: "dal_bhat", confidence: 0.5 },
//   { name: "bhat", confidence: 0.4 },
//   { name: "dal_bhat", confidence: 0.6 }
// ]

    if (!detections.length) {
      return res.status(200).json({
        success: false,
        detectedFoods: [],
      });
    }

    // ["dal_bhat", "bhat", "dal_bhat"]

    const uniqueFoods = [
      ...new Set(
        detections.map((d) => d.name).filter(Boolean)
      ),

      //removes the duplicates by set and null values by filter and ... : array  
    ];

    // console.log(uniqueFoods)

    const detectedFoods = await Promise.all(
      uniqueFoods.map(async (food, index) => {
        const match = detections.find(
          (d) => d.name === food
        );
        
        const nutrition =
          (await fetchNutrition(food)) ||
          emptyNutrition;


        const description = (await fetchDescription(food))||" ";

        console.log(description);
        
 

        return {
          id: index + 1,
          name: food,

          confidence: match?.confidence
            ? Number(
                (match.confidence * 100).toFixed(1)
              )
            : 0,

          nutrition,
          description: description,

          safetyCheck: buildSafetyCheck(user, [food,]),
        };
      })
    );

    return res.status(200).json({
      success: true,
      detectedFoods,

      image : req.image,

      annotatedImage: aiResult?.annotatedImage
        ? `data:image/jpeg;base64,${aiResult.annotatedImage}`
        : null,
    });
  } catch (error) {
    console.log("SCAN ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  } finally {
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
    const {
      selectedFoods,
      totals,
      annotatedImage,
    } = req.body;

    if (
      !Array.isArray(selectedFoods) ||
      !selectedFoods.length
    ) {
      return res.status(400).json({
        message: "No foods selected",
      });
    }

    const meal = await foodModel.create({
      user: req.user.id,

      recognition: {
        name: "Custom Meal",
        confidence: 100,
        provider: "frontend",
        annotatedImage,
      },

      ingredients: selectedFoods.map(
        (f) => f.name
      ),

      nutrition: totals || emptyNutrition,

      selectedFoods,

      eatenAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      meal,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to save meal",
      error: error.message,
    });
  }
};

/* =========================
   HISTORY LIST
========================= */

exports.getTodaySummary = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const entries = await foodModel.find({
      user: req.user.id,
      eatenAt: { $gte: start },
    });

    const totals = calculateTotals(entries);

    return res.status(200).json({
      success: true,
      totals,
      count: entries.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching today summary",
      error: error.message,
    });
  }
};


exports.getHistory = async (req, res) => {
  try {
    const { filter = "all" } = req.query;

    const startDate = getDateFilter(filter);

    const query = {
      user: req.user.id,
    };

    if (startDate) {
      query.eatenAt = {
        $gte: startDate,
      };
    }

    const items = await foodModel
      .find(query)
      .select(
        "_id recognition nutrition eatenAt createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    const formatted = items.map((item) => ({
      id: item._id,

      name:
        item.recognition?.name || "Meal",

      calories:
        item.nutrition?.caloriesKcal || 0,

      annotatedImage:
        item.recognition?.annotatedImage || null,

      eatenAt: item.eatenAt,
    }));

    return res.status(200).json({
      success: true,
      items: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching history",
      error: error.message,
    });
  }
};

/* =========================
   FOOD DETAILS
========================= */

exports.getHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID",
      });
    }

    const item = await foodModel
      .findOne({
        _id: id,
        user: req.user.id,
      })
      .lean();

    if (!item) {
      return res.status(404).json({
        message: "Meal not found",
      });
    }

    return res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching item",
      error: error.message,
    });
  }
};

/* =========================
   SUMMARY
========================= */

exports.getPeriodSummary = async (req, res) => {
  try {
    const { range = "week" } = req.query;

    const startDate = getDateFilter(range);

    const entries = await foodModel.find({
      user: req.user.id,
      eatenAt: {
        $gte: startDate,
      },
    });

    const totals = calculateTotals(entries);

    return res.status(200).json({
      success: true,
      range,
      totals,
      count: entries.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error generating summary",
      error: error.message,
    });
  }
};

/* =========================
   WEEKLY INSIGHTS
========================= */

exports.getWeeklyInsights = async (
  req,
  res
) => {
  try {
    const startDate = getDateFilter("week");

    const entries = await foodModel.find({
      user: req.user.id,
      eatenAt: {
        $gte: startDate,
      },
    });

    const totals = calculateTotals(entries);

    const insights = [];

    if (totals.proteinG < 300) {
      insights.push(
        "Low protein intake this week."
      );
    }

    if (totals.caloriesKcal > 14000) {
      insights.push(
        "High calorie intake this week."
      );
    }

    if (totals.sugarG > 350) {
      insights.push(
        "High sugar intake this week."
      );
    }

    if (!insights.length) {
      insights.push(
        "Balanced nutrition this week 👏"
      );
    }

    return res.status(200).json({
      success: true,
      totals,
      insights,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error generating insights",
      error: error.message,
    });
  }
};

/* =========================
   UPDATE MEAL
========================= */

exports.updateHistoryItem = async (
  req,
  res
) => {
  try {
    const item = await foodModel.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!item) {
      return res.status(404).json({
        message: "Meal not found",
      });
    }

    Object.assign(
      item.nutrition,
      req.body
    );

    await item.save();

    return res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
};

/* =========================
   DELETE MEAL
========================= */

exports.deleteHistoryItem = async (
  req,
  res
) => {
  try {
    const deleted =
      await foodModel.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!deleted) {
      return res.status(404).json({
        message: "Meal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meal deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};


// import { HfInference } from "@huggingface/inference";
// import dotenv from "dotenv";

// dotenv.config();

// // Initialize Hugging Face with your token from .env
// const hf = new HfInference(process.env.HUGGINGFACEHUB_API_TOKEN);

// export const getFoodAnalysis = async (req, res) => {
//     try {
//         // 1. Get prediction data from your YOLO/TF model logic
//         // In a real app, 'req.body' would contain results from your model
//         const { label, confidence } = req.body; 

//         // 2. Logic gate: Confidence check (Mirroring your Python logic)
//         if (confidence < 0.95) {
//             return res.status(200).json({
//                 success: false,
//                 message: "Food not recognized. Please try another image."
//             });
//         }

//         // 3. Construct the prompt for Hugging Face
//         const prompt = `
//         You are an expert in Nepali cuisine. Write a simple and friendly food description in English.
//         Food: ${label}
        
//         Include:
//         - List the ingredients that are used to make the food.
//         - How Nepalis commonly eat it.
//         - Where it is popular.
//         - One interesting fact.
//         - Finally give nutritional information (protein, carbohydrate, fat, calorie) per 100gm.
//         - If you are unaware of the food, simply say 'I currently do not have more information about this food.'
//         `;

//         // 4. Call Hugging Face API
//         const response = await hf.chatCompletion({
//             model: "mistralai/Mistral-7B-Instruct-v0.2", // Or "meta-llama/Meta-Llama-3-8B"
//             messages: [
//                 { role: "system", content: "You are a helpful culinary expert." },
//                 { role: "user", content: prompt }
//             ],
//             max_tokens: 500,
//             temperature: 0.7,
//         });

//         const description = response.choices[0].message.content;

//         // 5. Return the result
//         res.status(200).json({
//             success: true,
//             food: label,
//             confidence: (confidence * 100).toFixed(2) + "%",
//             description: description.trim()
//         });

//     } catch (error) {
//         console.error("Backend Error:", error);
//         res.status(500).json({ success: false, error: "AI Generation failed" });
//     }
// };