import React, { useState, useContext } from "react";
import { View, ScrollView, StyleSheet, Text, AsyncStorage } from "react-native";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Input, Button, ButtonGroup } from "react-native-elements";
import { mask, unMask } from "remask";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";

import { SessionContext } from "../../context/Session";

export default function Cadastro() {
    const { signUp, setSession } = useContext(SessionContext);

    const [selectedIndex, useSelectedIndex] = useState(0);
    const sexos = ["Masculino", "Feminino"];

    const [cpf, setCPF] = useState("");
    const [data, setData] = useState("");

    function updateIndex(selectedIndex) {
        useSelectedIndex(selectedIndex);
    }

    const onChangeCPF = (value) => {
        const originalValue = unMask(value);
        const maskedValue = mask(originalValue, ["999.999.999-99"]);
        setCPF(maskedValue);
    };
    const onChangeData = (value) => {
        const originalValue = unMask(value);
        const maskedValue = mask(originalValue, ["99/99/9999"]);
        setData(maskedValue);
    };

    const formSchema = Yup.object().shape({
        nome: Yup.string().required("Campo obrigatório!"),
        email: Yup.string()
            .required("Campo obrigatório!")
            .email("Por favor, insira um e-mail válido!"),
        senha: Yup.string().required("Campo obrigatório!"),
        confirmarSenha: Yup.string()
            .oneOf([Yup.ref("senha")], "As senhas devem ser iguais!")
            .required("Campo obrigatório!"),
        cpf: Yup.string()
            .required("Campo obrigatório!")
            .min(14, "Por favor, insira um CPF válido!"),
        data_nasc: Yup.string()
            .required("Campo obrigatório!")
            .min(10, "Por favor, insira uma data válida!"),
    });

    return (
        <ScrollView style={styles.container}>
            <Formik
                validateOnChange={false}
                initialValues={{
                    nome: "",
                    cpf: "",
                    sexo: "Masculino",
                    data_nasc: "",
                    email: "",
                    senha: "",
                    confirmarSenha: "",
                }}
                onSubmit={async (
                    { nome, cpf, sexo, data_nasc, email, senha },
                    errors
                ) => {
                    let today = moment();
                    const minDate = moment("31/12/1919", "DD-MM-YYYY");
                    data_nasc = moment(data_nasc, "DD/MM/YYYY");
                    if (
                        moment.max(today, data_nasc) === data_nasc ||
                        moment.min(minDate, data_nasc) === data_nasc
                    ) {
                        errors.setFieldError(
                            "data_nasc",
                            "Insira uma data válida!"
                        );
                    }
                    const userData = {
                        nome,
                        cpf: unMask(cpf),
                        sexo,
                        data_nasc,
                        email,
                        senha,
                    };
                    console.log(userData);
                    await signUp(userData)
                        .then(async ({ data }) => {
                            console.log(data);
                            if (data.field)
                                errors.setFieldError(
                                    data.field,
                                    data.errorMessage
                                );
                            else {
                                const { _id } = data.usuario;
                                const { token } = data;
                                setSession(_id);
                                await AsyncStorage.setItem("usuario", _id);
                                await AsyncStorage.setItem("token", token);
                            }
                        })
                        .catch((response) => console.log(response));
                }}
                validationSchema={formSchema}
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
                            label="Nome"
                            leftIcon={() => (
                                <Icon
                                    name="portrait"
                                    color="#AAA"
                                    size={20}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            value={values.nome}
                            onChangeText={handleChange("nome")}
                            labelStyle={styles.inputLabel}
                            inputStyle={styles.input}
                            placeholder="Seu nome completo"
                            placeholderTextColor="#999"
                            keyboardType="default"
                            autoCapitalize="none"
                            autoCorrect={false}
                            errorMessage={errors.nome}
                            errorStyle={styles.error}
                        />

                        <Input
                            label="CPF"
                            leftIcon={() => (
                                <Icon
                                    name="assignment"
                                    color="#AAA"
                                    size={20}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            value={cpf}
                            onChangeText={(value) => {
                                onChangeCPF(value);
                                values.cpf = value;
                            }}
                            labelStyle={styles.inputLabel}
                            inputStyle={styles.input}
                            placeholder="Seu CPF (apenas números)"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={14}
                            errorMessage={errors.cpf}
                            errorStyle={styles.error}
                        />
                        <View style={styles.sexos}>
                            <Text style={styles.labelSexos}>Sexo</Text>
                            <ButtonGroup
                                onPress={(selectedIndex) => {
                                    updateIndex(selectedIndex);
                                    values.sexo = sexos[selectedIndex];
                                }}
                                selectedIndex={selectedIndex}
                                buttons={sexos}
                                textStyle={{ fontSize: 16 }}
                                selectedButtonStyle={{
                                    backgroundColor: "#2352FF",
                                }}
                                containerStyle={{}}
                            />
                        </View>

                        <Input
                            label="Data de nascimento"
                            leftIcon={() => (
                                <Icon
                                    name="today"
                                    color="#AAA"
                                    size={20}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            value={data}
                            onChangeText={(value) => {
                                onChangeData(value);
                                values.data_nasc = value;
                            }}
                            labelStyle={styles.inputLabel}
                            inputStyle={styles.input}
                            placeholder="dd/mm/aaaa"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={14}
                            errorMessage={errors.data_nasc}
                            errorStyle={styles.error}
                        />
                        <Input
                            label="E-mail"
                            leftIcon={() => (
                                <Icon
                                    name="mail"
                                    color="#AAA"
                                    size={20}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            value={values.email}
                            onChangeText={handleChange("email")}
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
                            label="Senha"
                            leftIcon={() => (
                                <Icon
                                    name="vpn-key"
                                    color="#AAA"
                                    size={20}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            value={values.senha}
                            onChangeText={handleChange("senha")}
                            labelStyle={styles.inputLabel}
                            inputStyle={styles.input}
                            placeholder="Sua senha"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            secureTextEntry={true}
                            errorMessage={errors.senha}
                            errorStyle={styles.error}
                        />

                        <Input
                            label="Confirmar senha"
                            leftIcon={() => (
                                <Icon
                                    name="vpn-key"
                                    color="#AAA"
                                    size={20}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            value={values.confirmarSenha}
                            onChangeText={handleChange("confirmarSenha")}
                            labelStyle={styles.inputLabel}
                            inputStyle={styles.input}
                            placeholder="Confirme sua senha"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            secureTextEntry={true}
                            errorMessage={errors.confirmarSenha}
                            errorStyle={styles.error}
                        />
                        <Button
                            title="Confirmar cadastro"
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
                style="auto"
                translucent={false}
                backgroundColor="#2352FF"
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },

    form: {
        alignSelf: "stretch",
        marginTop: 30,
        paddingHorizontal: 28,
        backgroundColor: "#FFF",
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
    sexos: {
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    labelSexos: {
        fontSize: 18,
        color: "#555",
        marginBottom: 5,
        fontWeight: "bold",
    },
});
