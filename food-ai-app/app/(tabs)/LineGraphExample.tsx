import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const LineGraphExample = () => {
  const screenWidth = Dimensions.get("window").width;

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [1800, 2100, 1900, 2500, 2200, 3000, 2800],
        color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`, // primary green
        strokeWidth: 3 // optional
      }
    ],
    legend: ["Daily Calories"] // optional
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`, // text color
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`, // axis labels
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#16a34a"
    }
  };

  return (
    <SafeAreaView>
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Calorie Progress</Text>
      <LineChart
        data={data}
        width={screenWidth - 40} // subtract padding
        height={220}
        chartConfig={chartConfig}
        bezier // makes the line smooth/curved
        style={styles.chart}
      />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e293b",
  },
  chart: {
    borderRadius: 16,
  },
});

export default LineGraphExample;