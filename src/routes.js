import React, { useContext } from "react";
import { View, Image, StatusBar, StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/SimpleLineIcons";

import { SessionContext } from "./context/Session";
import CarteiraProvider from "./context/Carteira";

import Login from "./screens/authentication/Login";
import Cadastro from "./screens/authentication/Cadastro";
import CadVac from "./screens/authentication/CadastroVacinas";
import forgotPassword from "./screens/authentication/newPassword/forgotPassword";
import resetPassword from "./screens/authentication/newPassword/resetPassword";

import Home from "./screens/authenticaded/Home";
import LearnMoreLink from "./screens/authenticaded/LearnMore";
import Agenda from "./screens/authenticaded/Agenda";
import QRCodeScanner from "./screens/authenticaded/QRCodeScanner";
import Perfil from "./screens/authenticaded/Perfil";
import Sobre from "./screens/authenticaded/Sobre";

import EditInfo from "./screens/authenticaded/profile/EditInfo";
import Dependentes from "./screens/authenticaded/profile/Dependentes";
import EditDependente from "./screens/authenticaded/profile/cadDependente/EditDependente";
import AddDependente from "./screens/authenticaded/profile/cadDependente/AddDependente";
import CadVacDep from "./screens/authenticaded/profile/cadDependente/CadVacDependente";

const Stack = createStackNavigator();

function AgendaStack() {
    return (
        <CarteiraProvider>
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
                        fontSize: 14,
                    },
                }}
            >
                <Stack.Screen
                    name="Agenda"
                    component={Agenda}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="QRCodeScanner"
                    component={QRCodeScanner}
                    options={{
                        title: "Escaneie o QR Code da vacina",
                    }}
                />
            </Stack.Navigator>
        </CarteiraProvider>
    );
}

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
            <Stack.Screen name="Dependentes" component={Dependentes} />
            <Stack.Screen
                name="EditDependente"
                component={EditDependente}
                options={{
                    title: "Editar dependente",
                }}
            />
            <Stack.Screen
                name="AddDependente"
                component={AddDependente}
                options={{
                    title: "Adicionar dependente",
                }}
            />
            <Stack.Screen
                name="CadVacDep"
                component={CadVacDep}
                options={{
                    title: "Vacinas do dependente",
                }}
            />
        </Stack.Navigator>
    );
}

function HomeStack() {
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
                    fontSize: 16,
                },
            }}
        >
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="LinkInfo"
                component={LearnMoreLink}
                options={({ route }) => ({ title: route.params.title })}
            />
        </Stack.Navigator>
    );
}

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

function Router() {
    const { isLoggedIn } = useContext(SessionContext);

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
                        component={HomeStack}
                    />
                    <Tab.Screen
                        name="Agenda"
                        options={{
                            tabBarIcon: ({ color }) => (
                                <Icon name="calendar" color={color} size={25} />
                            ),
                        }}
                        component={AgendaStack}
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
                        }}
                        name="Cadastro"
                        component={Cadastro}
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
                            title: "Suas vacinas",
                        }}
                        name="CadVac"
                        component={CadVac}
                    />
                    <AuthStack.Screen
                        options={{
                            headerTransparent: true,
                            headerTitleAlign: "center",
                            headerTintColor: "#2352FF",
                            headerStyle: {
                                height: 60,
                            },
                            headerTitleStyle: {
                                fontWeight: "bold",
                                fontSize: 20,
                            },
                            title: "",
                        }}
                        name="forgotPassword"
                        component={forgotPassword}
                    />
                    <AuthStack.Screen
                        options={{
                            headerTransparent: false,
                            headerTitleAlign: "center",
                            headerTintColor: "#2352FF",
                            headerStyle: {
                                backgroundColor: "#FFF",
                                height: 60,
                            },
                            headerTitleStyle: {
                                fontWeight: "bold",
                                fontSize: 20,
                            },
                            title: "Redefinição de senha",
                        }}
                        name="resetPassword"
                        component={resetPassword}
                    />
                </AuthStack.Navigator>
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    logo: {
        resizeMode: "contain",
        width: 400,
        height: 200,
    },
    title: {
        marginTop: 20,
        fontSize: 17,
        fontWeight: "bold",
    },
    unesp_cti: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    cti: {
        resizeMode: "contain",
        width: 100,
        height: 80,
        marginRight: 30,
    },
    unesp: {
        resizeMode: "contain",
        width: 150,
        height: 110,
    },
});

export { PerfilStack };

export default Router;
