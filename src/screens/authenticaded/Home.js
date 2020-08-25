import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { SessionContext } from '../../context/Session';

export default function Home() {
  const { signOut } = useContext(SessionContext);

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <TouchableOpacity onPress={signOut}>
        <Text style={{ color: '#00f' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
});