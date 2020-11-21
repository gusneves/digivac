import React from "react";
import { WebView } from "react-native-webview";
import { StatusBar } from "react-native";

export default function LearnMoreLink({ route, navigation }) {
    return (
        <>
            <WebView source={{ uri: route.params.link }} />
            <StatusBar
                barStyle={"light-content"}
                translucent={false}
                backgroundColor="#2352FF"
            />
        </>
    );
}
