//PRIMEIRA TELA - USUARIO ENTRA COM EMAIL CADASTRADO
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    View,
    Text,
    Alert,
    StyleSheet,
    StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "../../../services/api";
import { Input, Button } from "react-native-elements";

import { Formik } from "formik";
import * as Yup from "yup";

export default function forgotPassword({ navigation }) {
    const formSchema = Yup.object().shape({
        email: Yup.string()
            .required("Campo obrigatório!")
            .email("Por favor, insira um e-mail válido!"),
    });

    return (
        <KeyboardAvoidingView
            enabled={Platform.OS === "ios"}
            behavior="padding"
            style={styles.container}
        >
            <Text style={styles.text}>
                Insira seu e-mail abaixo para o envio do código de redefinição
                de senha
            </Text>
            <Formik
                validationSchema={formSchema}
                validateOnChange={false}
                initialValues={{
                    email: "",
                }}
                onSubmit={async ({ email }) => {
                    await api
                        .post("/usuario/forgot-password", { email })
                        .then((response) => {
                            if (response.status === 400) {
                                Alert.alert("Erro", response.error);
                                return;
                            }
                            Alert.alert(
                                "Concluído",
                                "Te enviamos um e-mail com seu código de redefinição de senha."
                            );
                            navigation.navigate("resetPassword");
                        })
                        .catch((err) => {
                            Alert.alert("Erro", err.response.data.error);
                        });
                }}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    isSubmitting,
                }) => (
                    <View style={styles.form}>
                        <Input
                            value={values.email}
                            onChangeText={handleChange("email")}
                            leftIcon={() => (
                                <Icon
                                    name="mail"
                                    color="#AAA"
                                    size={20}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            labelStyle={styles.inputLabel}
                            inputStyle={styles.input}
                            placeholder="Seu e-mail"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            errorMessage={errors.email}
                            errorStyle={styles.error}
                        />
                        <Button
                            title="Enviar código"
                            type="solid"
                            raised={true}
                            onPress={handleSubmit}
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonTitle}
                            containerStyle={styles.buttonContainer}
                            loading={isSubmitting}
                        />
                    </View>
                )}
            </Formik>
            <StatusBar
                barStyle={"dark-content"}
                translucent={false}
                backgroundColor="#FFF"
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
        padding: 15,
    },
    form: {
        alignSelf: "stretch",
        paddingHorizontal: 15,
    },
    text: {
        color: "#444",
        fontSize: 18,
        marginBottom: 40,
        lineHeight: 24,
        textAlign: "center",
        fontWeight: "bold",
    },
    input: {
        color: "#444",
    },

    button: {
        backgroundColor: "#2352FF",
    },
    buttonTitle: {
        fontSize: 18,
    },
    buttonContainer: {
        margin: 10,
    },
    error: {
        fontSize: 13,
        fontStyle: "italic",
    },
});
