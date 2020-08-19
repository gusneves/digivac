import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/SimpleLineIcons";

import { SessionContext } from './context/Session';

import Home from "./Screens/Home";
import Agenda from "./Screens/Agenda";
import Perfil from "./Screens/Perfil";
import Sobre from "./Screens/Sobre";
import Login from './Screens/Login';

const Tab = createBottomTabNavigator();

function Router() {
  const { isLoggedIn } = useContext(SessionContext);

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeBackgroundColor: "#2352FF",
          activeTintColor: "#FFF",
          inactiveBackgroundColor: "#FFFFFF",
          inactiveTintColor: "#2352FF",
        }}>
          {isLoggedIn ? (
            <>
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
            </>
          ) : (
            <Tab.Screen
              name='Login'
              component={Login}
              options={{
                tabBarVisible: false
              }}
            />
          )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Router;