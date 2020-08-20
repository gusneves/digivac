import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Agenda extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Agenda</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
});
