// import axios from "axios";
// import { Platform } from "react-native";

// let defaultBaseURL = "http://192.168.16.100:5000";

// // On Android emulator, localhost refers to the emulator itself.
// if (Platform.OS === "android") {
//   defaultBaseURL = "http://10.0.2.2:5000";
// }

// const baseURL =
//   process.env.EXPO_PUBLIC_API_URL ;

// export const api = axios.create({
//   baseURL,
//   timeout: 10000
// });

// export const setAuthToken = (token: string | null) => {
//   if (token) {
//     api.defaults.headers.common.Authorization = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common.Authorization;
//   }
// };

// api.interceptors.request.use(async (config) => {
//   const token = await require("@react-native-async-storage/async-storage").default.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

import axios from "axios";
import { Platform } from "react-native";

let defaultBaseURL = "http://192.168.16.100:5000"; 

if (Platform.OS === "android") {
  defaultBaseURL = "http://10.0.2.2:5000";
} else if (Platform.OS === "ios") {
  defaultBaseURL = "http://localhost:5000";
}

const baseURL = process.env.EXPO_PUBLIC_API_URL || defaultBaseURL;

export const api = axios.create({
  baseURL,
  timeout: 10000
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

api.interceptors.request.use(
  async (config) => {

    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);