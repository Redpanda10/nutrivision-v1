// import { create } from "zustand";

// type Food = {
//   _id: string;
//   recognition: {
//     name: string;
//     confidence: number;
//     annotatedImage?: string;
//   };
//   nutrition: {
//     caloriesKcal: number;
//     proteinG: number;
//     carbsG: number;
//     fatG: number;
//   };
//   createdAt: string;
// };

// type FoodState = {
//   foods: Food[];

//   setFoods: (foods: Food[]) => void;

//   addFood: (food: Food) => void;

//   clearFoods: () => void;
// };

// export const useFoodStore = create<FoodState>((set) => ({
//   foods: [],

//   setFoods: (foods) => set({ foods }),

//   addFood: (food) =>
//     set((state) => ({
//       foods: [food, ...state.foods],
//     })),

//   clearFoods: () => set({ foods: [] }),
// }));

import { create } from "zustand";

type Food = {
  _id: string;
  recognition: {
    name: string;
    confidence: number;
    annotatedImage?: string;
  };
  nutrition: {
    caloriesKcal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
  createdAt: string;
};

type FoodState = {
  foods: Food[];
  needsRefresh: boolean; // Add this
  setFoods: (foods: Food[]) => void;
  addFood: (food: Food) => void;
  triggerRefresh: () => void; // Add this
  clearFoods: () => void;
};

export const useFoodStore = create<FoodState>((set) => ({
  foods: [],
  needsRefresh: true, // Starts true so it loads on first open

  setFoods: (foods) => set({ 
    foods, 
    needsRefresh: false // Once data is set, we don't need to refresh anymore
  }),

  addFood: (food) =>
    set((state) => ({
      foods: [food, ...state.foods],
      needsRefresh: true, // Trigger refresh when a new food is added manually
    })),

  triggerRefresh: () => set({ needsRefresh: true }), // Call this after your API save

  clearFoods: () => set({ foods: [], needsRefresh: true }),
}));