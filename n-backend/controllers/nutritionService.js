require("dotenv").config();
const axios = require("axios");

const NUTRITION_DB_URL = process.env.NUTRITION_DB_URL;

const emptyNutrition = {
  caloriesKcal: 0,
  proteinG:     0,
  carbsG:       0,
  fatG:         0,
  sugarG:       0,
};

const normaliseKey = (foodName) => {
  const base = String(foodName)
    .trim()
    .replace(/[\s-]+/g, "_"); // spaces/hyphens → underscore

  
  return [
    base,
    base.charAt(0).toUpperCase() + base.slice(1),
  ];
};

const fetchNutrition = async (foodName) => {
  try {
    const response = await axios.get(NUTRITION_DB_URL, {
      timeout: 5000, 
    });

    const db = response.data; 
    const [keyA, keyB] = normaliseKey(foodName);
    const entry = db[keyA] || db[keyB];

    if (!entry) {
      console.warn(`[nutritionService] No entry for "${foodName}" (tried: "${keyA}", "${keyB}")`);
      return emptyNutrition;
    }

    return entry;
  } catch (err) {
    console.error(`[nutritionService] Failed to fetch DB from S3:`, err.message);
    return emptyNutrition;
  }
};

module.exports = { fetchNutrition };
