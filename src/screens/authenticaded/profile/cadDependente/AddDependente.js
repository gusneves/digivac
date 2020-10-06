import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, AsyncStorage } from "react-native";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Input, Button, ButtonGroup } from "react-native-elements";
import { mask, unMask } from "remask";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";

import api from "../../../../services/api";

export default function AddDependente({ navigation }) {
    const [selectedIndex, useSelectedIndex] = useState(0);
    const sexos = ["Masculino", "Feminino"];

    const [data, setData] = useState("");

    const [id, setId] = useState("");

    useEffect(() => {
        getUserData();
    }, []);

    async function getUserData() {
        const userId = await AsyncStorage.getItem("usuario");

        setId(userId);
    }

    async function cadDep(data) {
        return await api.put("/usuario/dep/" + id, data);
    }

    function updateIndex(selectedIndex) {
        useSelectedIndex(selectedIndex);
    }

    const onChangeData = (value) => {
        const originalValue = unMask(value);
        const maskedValue = mask(originalValue, ["99/99/9999"]);
        setData(maskedValue);
    };

    const formSchema = Yup.object().shape({
        nome: Yup.string().required("Campo obrigatório!"),
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
                    sexo: "Masculino",
                    data_nasc: "",
                }}
                onSubmit={async ({ nome, sexo, data_nasc }, errors) => {
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
                        return;
                    }
                    const dependentes = {
                        nome,
                        sexo,
                        data_nasc,
                    };
                    console.log(dependentes);

                    navigation.navigate("CadVacDep", { dependentes });
                    /*await cadDep(dependentes)
                        .then(async ({ data }) => {
                            console.log(data);
                            if (data.field)
                                errors.setFieldError(
                                    data.field,
                                    data.errorMessage
                                );
                            else {
                                const popStack = StackActions.pop(2);
                                navigation.dispatch(popStack);
                            }
                        })
                        .catch((response) => console.log(response));*/
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
                            placeholder="Nome completo"
                            placeholderTextColor="#999"
                            keyboardType="default"
                            autoCapitalize="none"
                            autoCorrect={false}
                            errorMessage={errors.nome}
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
                        <Button
                            title="Confirmar dependente"
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
