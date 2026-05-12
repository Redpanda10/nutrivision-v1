import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const HistoryGraph = ({ data = [], filter = "today" }) => {
  
  const getChartData = () => {
    if (!data || data.length === 0) {
      return { labels: ["No Data"], datasets: [{ data: [0] }] };
    }

    const grouped = {};

    data.forEach((item) => {
      const dateObj = new Date(item.eatenAt||item.createdAt);
      let key;

      if (filter === "today") {
        // Hourly Bucket (e.g., "14:00")
        key = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (filter === "week") {
        // Daily Bucket (e.g., "Mon")
        key = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      } else if (filter === "month") {
        // Weekly Bucket (e.g., "Week 1")
        const day = dateObj.getDate();
        key = `W${Math.ceil(day / 7)}`;
      } else {
        // Default: Date Bucket (e.g., "May 12")
        key = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }

      grouped[key] = (grouped[key] || 0) + (item.calories || 0);
    });

    // To keep the chart from getting too crowded, we slice the labels
    // We reverse them because usually, the API returns newest first
    let labels = Object.keys(grouped).reverse();
    let values = Object.values(grouped).reverse();

    // Limit visible points for readability
    if (filter === "today") {
        // Sort hourly keys (0:00 to 23:00)
        labels = Object.keys(grouped).sort((a,b) => parseInt(a) - parseInt(b));
        values = labels.map(k => grouped[k]);
    }

    return {
      labels: labels.length > 0 ? labels : ["Empty"],
      datasets: [{ data: values.length > 0 ? values : [0] }],
    };
  };

  const processedData = getChartData();

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    propsForDots: { r: "4", strokeWidth: "2", stroke: "#16a34a" },
    propsForBackgroundLines: { strokeDasharray: "6", stroke: "#f1f5f9" },
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
            {filter === 'today' ? 'Hourly Intake' : 'Calorie Trend'}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{filter.toUpperCase()}</Text>
        </View>
      </View>

      <LineChart
        data={processedData}
        width={screenWidth - 32}
        height={180}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withVerticalLines={false}
        transparent
        fromZero={true} // Starts graph at 0 for better accuracy
      />
    </View>
  );
};

// ... keep your existing styles from the previous message
const styles = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      marginVertical: 10,
      paddingVertical: 16,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: "#ecfdf5",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: "800",
      color: "#1e293b",
    },
    badge: {
      backgroundColor: "#f0fdf4",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: "700",
      color: "#16a34a",
    },
    chart: {
      paddingRight: 45,
      borderRadius: 16,
    },
  });

export default HistoryGraph;