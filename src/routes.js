import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/SimpleLineIcons";

import Home from "./Screens/Home";
import Agenda from "./Screens/Agenda";
import Perfil from "./Screens/Perfil";
import Sobre from "./Screens/Sobre";

const Tab = createBottomTabNavigator();

function Router() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeBackgroundColor: "#21F",
          activeTintColor: "#FFF",
          inactiveBackgroundColor: "#FFF",
          inactiveTintColor: "#21f",
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="home" color={color} size={25} />
            ),
          }}
          component={Home}
        />
        <Tab.Screen
          name="Agenda"
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="calendar" color={color} size={25} />
            ),
          }}
          component={Agenda}
        />
        <Tab.Screen
          name="Perfil"
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="user" color={color} size={25} />
            ),
          }}
          component={Perfil}
        />
        <Tab.Screen
          name="Sobre"
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="question" color={color} size={25} />
            ),
          }}
          component={Sobre}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Router;