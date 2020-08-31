import React, { useRef, useContext, useState } from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Formik } from "formik";
import * as Yup from "yup";

import logo from "../../assets/logo.png";

import { SessionContext } from "../../context/Session";

export default function Login({ navigation }) {
    const [visibilityIcon, useVisibilityIcon] = useState("visibility-off");
    const [secureEntry, useSecureEntry] = useState(true);

    function changeVisibility(){
        visibilityIcon === "visibility-off" ? useVisibilityIcon("visibility") : useVisibilityIcon("visibility-off")
        useSecureEntry(!secureEntry)
        console.log(visibilityIcon, secureEntry);
    }

    const formSchema = Yup.object().shape({
        email: Yup.string()
            .required("Campo obrigatório!")
            .email("Por favor, insira um e-mail válido!"),
        password: Yup.string().required("Campo obrigatório!"),
    });

    const { signIn } = useContext(SessionContext);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            enabled={Platform.OS === "ios"}
            behavior="padding"
        >
            <Image style={styles.logo} source={logo} />
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                }}
                onSubmit={async (values, errors) => {
                    await signIn(values.email, values.password).then(() => {
                        errors.setFieldError(
                            "password",
                            "Usuário ou senha incorretos!"
                        );
                    });
                }}
                validationSchema={formSchema}
            >
                {({ values, handleChange, handleSubmit, errors }) => (
                    <View style={styles.form}>
                        <Input
                            label="E-mail"
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
                        />

                        <Input
                            label="Senha"
                            value={values.password}
                            onChangeText={handleChange("password")}
                            leftIcon={() => (
                                <Icon
                                    name="lock"
                                    color="#AAA"
                                    size={20}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            rightIcon={() => (
                                <Icon
                                    name={visibilityIcon}
                                    color="#AAA"
                                    size={20}
                                    style={{ marginRight: 4 }}
                                    onPress={() => {changeVisibility()}}
                                />
                            )}
                            labelStyle={styles.inputLabel}
                            inputStyle={styles.input}
                            placeholder="Sua senha"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            secureTextEntry={secureEntry}
                            errorMessage={errors.password}
                            errorStyle={styles.error}
                        />

                        <Button
                            title="Login"
                            type="solid"
                            raised={true}
                            onPress={handleSubmit}
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonTitle}
                            containerStyle={styles.buttonContainer}
                        />

                        <Button
                            title="Ainda não possui cadastro?"
                            type="clear"
                            onPress={() => {
                                navigation.navigate("Cadastro");
                            }}
                            titleStyle={styles.registerButtonText}
                        />
                    </View>
                )}
            </Formik>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
    },

    logo: {
        width: 180,
        height: 150,
        resizeMode: "contain",
    },

    form: {
        alignSelf: "stretch",
        marginTop: 30,
        paddingHorizontal: 28,
    },

    inputLabel: {
        fontSize: 18,
        color: "#555",
        marginBottom: 5,
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
    registerButtonText: {
        fontSize: 16,
        color: "#45a16b",
    },
    error: {
        fontSize: 13,
        fontStyle: "italic",
    },
});
