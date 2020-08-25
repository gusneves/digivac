import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Configs extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Configurações</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
});