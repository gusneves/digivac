import React, { useState } from "react";
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    StatusBar,
    Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StackActions } from "@react-navigation/native";
import { Input, Button } from "react-native-elements";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from "react-native-confirmation-code-field";

import api from "../../../services/api";

import { Formik } from "formik";
import * as Yup from "yup";

const CELL_COUNT = 6;

export default function resetPassword({ navigation }) {
    const [visibilityIcon, useVisibilityIcon] = useState("visibility-off");
    const [secureEntry, useSecureEntry] = useState(true);

    const [value, setValue] = useState("");
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    function changeVisibility() {
        visibilityIcon === "visibility-off"
            ? useVisibilityIcon("visibility")
            : useVisibilityIcon("visibility-off");
        useSecureEntry(!secureEntry);
        console.log(visibilityIcon, secureEntry);
    }

    const formSchema = Yup.object().shape({
        email: Yup.string()
            .required("Campo obrigatório!")
            .email("Por favor, insira um e-mail válido!"),
        senha: Yup.string()
            .required("Campo obrigatório!")
            .min(4, "Senha muito pequena!"),
        confirmarSenha: Yup.string()
            .oneOf([Yup.ref("senha")], "As senhas devem ser iguais!")
            .required("Campo obrigatório!"),
    });

    return (
        <ScrollView
            contentContainerStyle={styles.contentContainer}
            style={styles.container}
        >
            <Formik
                validateOnChange={false}
                validationSchema={formSchema}
                initialValues={{
                    email: "",
                    senha: "",
                    confirmarSenha: "",
                    token: "",
                }}
                onSubmit={async ({ email, senha, token }) => {
                    console.log(token.toUpperCase());
                    if (token.length < 6) {
                        Alert.alert(
                            "Alerta",
                            "Por favor, preencha todo o código!"
                        );
                        return;
                    }
                    token = token.toUpperCase();
                    await api
                        .post("/usuario/reset-password", {
                            email,
                            senha,
                            token,
                        })
                        .then((response) => {
                            Alert.alert(
                                "Concluído",
                                "Sua senha foi alterada com sucesso!"
                            );
                            const popStack = StackActions.pop(2);
                            navigation.dispatch(popStack);
                        })
                        .catch((err) => {
                            Alert.alert("Erro", err.response.data.error);
                        });
                }}
            >
                {({
                    values,
                    errors,
                    isSubmitting,
                    handleChange,
                    handleSubmit,
                }) => (
                    <View style={styles.form}>
                        <View style={styles.token}>
                            <Text style={styles.labelToken}>Código</Text>
                            <CodeField
                                ref={ref}
                                {...props}
                                value={value}
                                onChangeText={(value) => {
                                    setValue(value);
                                    values.token = value;
                                }}
                                autoCapitalize={"characters"}
                                cellCount={CELL_COUNT}
                                rootStyle={styles.codeFieldRoot}
                                keyboardType="visible-password"
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                    <Text
                                        key={index}
                                        style={[
                                            styles.cell,
                                            isFocused && styles.focusCell,
                                        ]}
                                        onLayout={getCellOnLayoutHandler(index)}
                                    >
                                        {symbol ||
                                            (isFocused ? <Cursor /> : null)}
                                    </Text>
                                )}
                            />
                        </View>
                        <Input
                            value={values.email}
                            label={"E-mail"}
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
                        <Input
                            label="Nova senha"
                            value={values.senha}
                            onChangeText={handleChange("senha")}
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
                                    onPress={() => {
                                        changeVisibility();
                                    }}
                                />
                            )}
                            labelStyle={styles.inputLabel}
                            inputStyle={styles.input}
                            placeholder="Sua senha"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            secureTextEntry={secureEntry}
                            errorMessage={errors.senha}
                            errorStyle={styles.error}
                        />
                        <Input
                            label="Confirmar senha"
                            value={values.confirmarSenha}
                            onChangeText={handleChange("confirmarSenha")}
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
                                    onPress={() => {
                                        changeVisibility();
                                    }}
                                />
                            )}
                            labelStyle={styles.inputLabel}
                            inputStyle={styles.input}
                            placeholder="Sua senha"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            secureTextEntry={secureEntry}
                            errorMessage={errors.confirmarSenha}
                            errorStyle={styles.error}
                        />
                        <Button
                            title="Confirmar"
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
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        backgroundColor: "#FFF",
        padding: 15,
    },
    form: {
        alignSelf: "stretch",
        paddingHorizontal: 15,
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
    error: {
        fontSize: 13,
        fontStyle: "italic",
    },
    token: {
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    labelToken: {
        fontSize: 18,
        color: "#555",
        marginBottom: 5,
        fontWeight: "bold",
    },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        color: "#444",
        borderWidth: 2,
        borderColor: "#00000030",
        textAlign: "center",
        borderRadius: 10,
    },
    focusCell: {
        borderColor: "#2352FF",
    },
});
