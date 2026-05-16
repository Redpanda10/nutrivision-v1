// nutritionDB.js
// Local nutrition database for all YOLO-detected food classes.
// All values are per 100g serving unless noted.
// Sources: USDA FoodData Central averages, standard nutritional references.

const nutritionDB = {

  // ── Nepali / South Asian dishes ──────────────────────────────────────────

  Achar:       { caloriesKcal: 45,  proteinG: 1.2, carbsG: 9.0,  fatG: 0.5, sugarG: 5.0  }, // pickled vegetables
  Bhat:        { caloriesKcal: 130, proteinG: 2.7, carbsG: 28.2, fatG: 0.3, sugarG: 0.0  }, // cooked white rice
  Butter_naan: { caloriesKcal: 317, proteinG: 8.7, carbsG: 50.0, fatG: 9.0, sugarG: 2.5  }, // naan with butter
  Daal:        { caloriesKcal: 116, proteinG: 7.6, carbsG: 20.0, fatG: 0.4, sugarG: 1.8  }, // cooked lentils
  Dahi:        { caloriesKcal: 61,  proteinG: 3.5, carbsG: 4.7,  fatG: 3.3, sugarG: 4.7  }, // plain whole-milk yogurt
  Gundruk:     { caloriesKcal: 35,  proteinG: 3.1, carbsG: 5.0,  fatG: 0.4, sugarG: 1.0  }, // fermented mustard greens
  Kheer:       { caloriesKcal: 150, proteinG: 4.0, carbsG: 25.0, fatG: 4.5, sugarG: 18.0 }, // rice pudding
  Masu:        { caloriesKcal: 165, proteinG: 25.0,carbsG: 0.0,  fatG: 7.0, sugarG: 0.0  }, // cooked chicken
  Momo:        { caloriesKcal: 190, proteinG: 10.0,carbsG: 22.0, fatG: 6.5, sugarG: 1.5  }, // steamed pork dumplings
  Noodles:     { caloriesKcal: 138, proteinG: 4.5, carbsG: 25.0, fatG: 2.0, sugarG: 0.5  }, // cooked egg noodles
  Omelet:      { caloriesKcal: 154, proteinG: 10.6,carbsG: 0.4,  fatG: 12.0,sugarG: 0.4  }, // plain egg omelet
  Roti:        { caloriesKcal: 297, proteinG: 9.0, carbsG: 55.0, fatG: 4.0, sugarG: 1.0  }, // whole wheat chapati
  Saag:        { caloriesKcal: 43,  proteinG: 4.0, carbsG: 5.5,  fatG: 1.2, sugarG: 0.8  }, // cooked mustard greens
  Sandwich:    { caloriesKcal: 250, proteinG: 11.0,carbsG: 32.0, fatG: 8.0, sugarG: 4.0  }, // wheat bread sandwich
  Tarkari:     { caloriesKcal: 80,  proteinG: 2.5, carbsG: 12.0, fatG: 2.5, sugarG: 4.0  }, // mixed vegetable curry

  // ── Snacks & street food ─────────────────────────────────────────────────

  bhujiya:     { caloriesKcal: 520, proteinG: 15.0,carbsG: 55.0, fatG: 28.0,sugarG: 3.0  }, // fried chickpea noodle snack
  chatni:      { caloriesKcal: 90,  proteinG: 1.0, carbsG: 20.0, fatG: 0.5, sugarG: 14.0 }, // tamarind chutney
  dhindo:      { caloriesKcal: 110, proteinG: 3.5, carbsG: 23.0, fatG: 0.8, sugarG: 0.5  }, // buckwheat porridge
  jeri:        { caloriesKcal: 360, proteinG: 4.0, carbsG: 65.0, fatG: 10.0,sugarG: 40.0 }, // jalebi / sel-roti style sweet
  pakoda:      { caloriesKcal: 310, proteinG: 6.5, carbsG: 35.0, fatG: 16.0,sugarG: 2.0  }, // vegetable pakora fried
  panipuri:    { caloriesKcal: 180, proteinG: 4.0, carbsG: 32.0, fatG: 4.5, sugarG: 3.5  }, // pani puri
  papad:       { caloriesKcal: 350, proteinG: 20.0,carbsG: 57.0, fatG: 3.0, sugarG: 1.5  }, // papadum
  selroti:     { caloriesKcal: 330, proteinG: 5.0, carbsG: 60.0, fatG: 8.0, sugarG: 10.0 }, // rice flour fried bread
  yomari:      { caloriesKcal: 210, proteinG: 4.5, carbsG: 42.0, fatG: 2.5, sugarG: 12.0 }, // rice flour steamed dumpling

  // ── Fast food ────────────────────────────────────────────────────────────

  burger:      { caloriesKcal: 295, proteinG: 17.0,carbsG: 24.0, fatG: 14.0,sugarG: 5.0  }, // beef hamburger
  pizza:       { caloriesKcal: 266, proteinG: 11.0,carbsG: 33.0, fatG: 10.0,sugarG: 3.5  }, // cheese pizza

  // ── Beverages ────────────────────────────────────────────────────────────

  chiya:       { caloriesKcal: 40,  proteinG: 1.5, carbsG: 5.5,  fatG: 1.5, sugarG: 4.5  }, // milk tea (masala/plain)

  // ── Fruits ───────────────────────────────────────────────────────────────
annona:      { caloriesKcal: 94,  proteinG: 2.1, carbsG: 23.6, fatG: 0.3, sugarG: 18.0 }, // custard apple
  apple:       { caloriesKcal: 52,  proteinG: 0.3, carbsG: 13.8, fatG: 0.2, sugarG: 10.4 },
  banana:      { caloriesKcal: 89,  proteinG: 1.1, carbsG: 23.0, fatG: 0.3, sugarG: 12.2 },
  guava:       { caloriesKcal: 68,  proteinG: 2.6, carbsG: 14.3, fatG: 1.0, sugarG: 8.9  },
  lemon:       { caloriesKcal: 29,  proteinG: 1.1, carbsG: 9.3,  fatG: 0.3, sugarG: 2.5  },
  orange:      { caloriesKcal: 47,  proteinG: 0.9, carbsG: 11.8, fatG: 0.1, sugarG: 9.4  },
  pear:        { caloriesKcal: 57,  proteinG: 0.4, carbsG: 15.2, fatG: 0.1, sugarG: 9.8  },
  pineapple:   { caloriesKcal: 50,  proteinG: 0.5, carbsG: 13.1, fatG: 0.1, sugarG: 9.9  },
  pitaya:      { caloriesKcal: 60,  proteinG: 1.2, carbsG: 13.0, fatG: 0.4, sugarG: 8.0  }, // dragon fruit
  watermelon:  { caloriesKcal: 30,  proteinG: 0.6, carbsG: 7.6,  fatG: 0.2, sugarG: 6.2  },

  // ── Vegetables ───────────────────────────────────────────────────────────

  beet:        { caloriesKcal: 43,  proteinG: 1.6, carbsG: 9.6,  fatG: 0.2, sugarG: 6.8  },
  bell_pepper: { caloriesKcal: 31,  proteinG: 1.0, carbsG: 6.0,  fatG: 0.3, sugarG: 4.2  }, // red sweet pepper
  cabbage:     { caloriesKcal: 25,  proteinG: 1.3, carbsG: 5.8,  fatG: 0.1, sugarG: 3.2  },
  carrot:      { caloriesKcal: 41,  proteinG: 0.9, carbsG: 10.0, fatG: 0.2, sugarG: 4.7  },
  cucumber:    { caloriesKcal: 16,  proteinG: 0.7, carbsG: 3.6,  fatG: 0.1, sugarG: 1.7  },
  eggplant:    { caloriesKcal: 25,  proteinG: 1.0, carbsG: 6.0,  fatG: 0.2, sugarG: 3.5  },
  garlic:      { caloriesKcal: 149, proteinG: 6.4, carbsG: 33.1, fatG: 0.5, sugarG: 1.0  },
  onion:       { caloriesKcal: 40,  proteinG: 1.1, carbsG: 9.3,  fatG: 0.1, sugarG: 4.2  },
  potato:      { caloriesKcal: 77,  proteinG: 2.0, carbsG: 17.5, fatG: 0.1, sugarG: 0.8  },
  tomato:      { caloriesKcal: 18,  proteinG: 0.9, carbsG: 3.9,  fatG: 0.2, sugarG: 2.6  },
  zucchini:    { caloriesKcal: 17,  proteinG: 1.2, carbsG: 3.1,  fatG: 0.3, sugarG: 2.5  },

  // ── Other ────────────────────────────────────────────────────────────────

  egg:         { caloriesKcal: 143, proteinG: 12.6,carbsG: 0.7,  fatG: 9.5, sugarG: 0.4  }, // whole raw egg
  salad:       { caloriesKcal: 20,  proteinG: 1.5, carbsG: 3.5,  fatG: 0.3, sugarG: 1.8  }, // garden salad (no dressing)
};

module.exports = nutritionDB;