import React, { createContext, useState, useEffect } from "react";
import { AsyncStorage } from "react-native";

import api from "../services/api";

export const SessionContext = createContext();

export default function SessionProvider({ children }) {
    const [isLoggedIn, setSession] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStoragedData() {
            const storagedUser = await AsyncStorage.getItem("usuario");
            const storagedToken = await AsyncStorage.getItem("token");

            if (storagedUser && storagedToken) {
                api.defaults.headers.Authorization = `Bearer ${storagedToken}`;

                setSession(storagedUser);
            }

            setTimeout(() => {
                setLoading(false);
            }, 4000);
        }

        loadStoragedData();
    }, []);

    async function signIn(email, password) {
        return await api.post("session", {
            email,
            senha: password,
        });
    }

    async function tokenVerify(token) {
        const tokenVerify = await api
            .get("/session/authentication", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        if (!tokenVerify.data.ok) {
            reject("Token recusado", null);
        }
        api.defaults.headers.Authorization = `Bearer ${token}`;
    }

    function signOut() {
        AsyncStorage.clear().then(() => {
            setSession(null);
        });
    }

    async function signUp(userdata) {
        return await api.post("/usuario", userdata);
    }

    async function checkEmailCPF(email, cpf) {
        return await api.get(`/usuario/${email}/${cpf}`);
    }

    return (
        <SessionContext.Provider
            value={{
                isLoggedIn,
                setSession,
                loading,
                setLoading,
                signIn,
                signOut,
                signUp,
                checkEmailCPF,
                tokenVerify,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}
