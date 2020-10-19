import React, { useContext, useEffect, useState } from "react";
import { View, Image, StatusBar, StyleSheet, Text } from "react-native";
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
import AddDependente from "./screens/authenticaded/profile/cadDependente/AddDependente";
import CadVacDep from "./screens/authenticaded/profile/cadDependente/CadVacDependente";

import logo from './assets/logo.png';
import cti from './assets/cti.png';
import unesp from './assets/unesp.png';

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
            <Stack.Screen name="Dependentes" component={Dependentes} />
            <Stack.Screen
                name="AddDependente"
                component={AddDependente}
                options={{
                    title: "Adicionar Dependente",
                }}
            />
            <Stack.Screen
                name="CadVacDep"
                component={CadVacDep}
                options={{
                    title: "Vacinas do Dependente",
                }}
            />
        </Stack.Navigator>
    );
}

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

const SplashScreen = () => {
    return (
        <>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: '#fff',
                    marginHorizontal: 40
                }}
            >
                <Image style={styles.logo} source={logo} />
                <Text style={styles.title} >Sua carteira de vacinação online</Text>
                <View style={styles.unesp_cti}>
                    <Image style={styles.cti} source={cti} />
                    <Image style={styles.unesp} source={unesp} />
                </View>
            </View>
            <StatusBar
                barStyle="dark-content"
                translucent={false}
                backgroundColor="#FFF"
            />
        </>
    );
}

function Router() {
    const { isLoggedIn, loading } = useContext(SessionContext);

    if (loading) {
        return (
            <SplashScreen />
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
                                title: "Suas vacinas",
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

const styles = StyleSheet.create({
    logo: {
        resizeMode: 'contain',
        width: 400,
        height: 200,
    },
    title: {
        marginTop: 20,
        fontSize: 17,
        fontWeight: 'bold'
    },
    unesp_cti: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cti: {
        resizeMode: 'contain',
        width: 100,
        height: 80,
        marginRight: 30
    },
    unesp: {
        resizeMode: 'contain',
        width: 150,
        height: 110,
    },
});

export { PerfilStack };

export default Router;
