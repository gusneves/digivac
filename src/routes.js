import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, Header } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/SimpleLineIcons";

import Home from "./Screens/Home";
import Agenda from "./Screens/Agenda";
import Perfil from "./Screens/Perfil";
import Sobre from "./Screens/Sobre";

import EditInfo from "./Screens/EditInfo";
import Dependentes from "./Screens/Dependentes";
import Configs from "./Screens/Configs";

const Stack = createStackNavigator();
function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Perfil"
        component={Perfil}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditInfo"
        component={EditInfo}
        options={{
          title: "Editar informações",
        }}
      />
      <Stack.Screen
        name="Configs"
        component={Configs}
        options={{
          title: "Configurações",
        }}
      />
      <Stack.Screen name="Dependentes" component={Dependentes} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function Router() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeBackgroundColor: "#2352FF",
          activeTintColor: "#FFF",
          inactiveBackgroundColor: "#FFFFFF",
          inactiveTintColor: "#2352FF",
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
          component={PerfilStack}
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

export { PerfilStack };

export default Router;
