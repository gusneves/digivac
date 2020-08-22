import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/SimpleLineIcons";

import { SessionContext } from "./context/Session";

import Login from "./screens/authentication/Login";
import Cadastro from "./screens/authentication/Cadastro";
import CadVac from "./screens/authentication/CadastroVacinas";

import Home from "./screens/authenticaded/Home";
import Agenda from "./screens/authenticaded/Agenda";
import Perfil from "./screens/authenticaded/Perfil";
import Sobre from "./screens/authenticaded/Sobre";

import EditInfo from "./screens/authenticaded/profile/EditInfo";
import Dependentes from "./screens/authenticaded/profile/Dependentes";
import Configs from "./screens/authenticaded/profile/Configs";

const Stack = createStackNavigator();

function PerfilStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                headerTintColor: "#FFF",
                headerStyle: {
                    backgroundColor: "#2352FF",
                    height: 60,
                },
                headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 20,
                },
            }}
        >
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
const AuthStack = createStackNavigator();

function Router() {
    const { isLoggedIn, loading } = useContext(SessionContext);

    if (loading) {
        // futura splash screen
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color="#999" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isLoggedIn ? (
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
            ) : (
                <AuthStack.Navigator>
                    <AuthStack.Screen
                        name="Login"
                        component={Login}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <AuthStack.Screen
                        options={{
                            headerTitleAlign: "center",
                            headerTintColor: "#FFF",
                            headerStyle: {
                                backgroundColor: "#2352FF",
                                height: 60,
                            },
                            headerTitleStyle: {
                                fontWeight: "bold",
                                fontSize: 20,
                            },
                            title:"Suas vacinas"
                        }}
                        name="CadVac"
                        component={CadVac}
                    />
                    <AuthStack.Screen
                        options={{
                            headerTitleAlign: "center",
                            headerTintColor: "#FFF",
                            headerStyle: {
                                backgroundColor: "#2352FF",
                                height: 60,
                            },
                            headerTitleStyle: {
                                fontWeight: "bold",
                                fontSize: 20,
                            },
                        }}
                        name="Cadastro"
                        component={Cadastro}
                    />
                </AuthStack.Navigator>
            )}
        </NavigationContainer>
    );
}

export { PerfilStack };

export default Router;
