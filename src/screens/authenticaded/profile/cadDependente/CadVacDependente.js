import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text, YellowBox } from "react-native";
import { StackActions } from "@react-navigation/native";
import { Button, Overlay, Divider } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { StatusBar } from "expo-status-bar";

import MarkSlider from "../../../../components/MarkSlider";

import api from "../../../../services/api";

export default function CadVacDep({ route, navigation }) {
    YellowBox.ignoreWarnings([
        "Non-serializable values were found in the navigation state",
    ]);

    const [overlay, setOverlay] = useState(true); //on-off do overlay
    const [vacinas, setVacinas] = useState(); //dados vacinas
    const [confirm, setConfirm] = useState(false); //overlay confirmação
    const [id, setId] = useState(""); //id do usuario - asyncstorage
    const [data, setData] = useState({
        //recebe as doses
        id: [],
        doses: [],
        doseAtual: [],
    });

    const marks = [
        { name: 0, value: 0 },
        { name: 1, value: 1 },
        { name: 2, value: 2 },
        { name: 3, value: 3 },
        { name: 4, value: 4 },
        { name: 5, value: 5 },
        { name: 6, value: 6 },
    ];

    function changeVisibility() {
        setOverlay(!overlay);
    }

    function changeConfirmation() {
        setConfirm(!confirm);
    }

    useEffect(() => {
        _getVacinas();
        getUserData();
    }, []);

    useEffect(() => {
        if (vacinas != null) prepareData();
    }, [vacinas]);

    async function getUserData() {
        const userId = await AsyncStorage.getItem("usuario");
        setId(userId);
    }

    async function cadDep(data) {
        return await api.put("/usuario/dep/" + id, data);
    }

    async function _getVacinas() {
        await api
            .get("/vacina")
            .then((response) => {
                setVacinas(response.data);
            })
            .catch((e) => {
                console.log("Erro ao pegar dados das vacinas: " + e.message);
            });
    }

    let aux = {
        id: data.id,
        doses: data.doses,
        doseAtual: data.doseAtual,
    };
    function prepareData() {
        vacinas.map((item) => {
            const { id, doses, doseAtual } = aux;
            id.push(item._id);
            doses.push(item.doses);
            doseAtual.push(0);
            setData(aux);
        });
    }

    function marcaDoses(id, doses) {
        let indexChanged = data.id.indexOf(id);
        aux.doseAtual[indexChanged] = doses;
        setData(aux);
    }

    async function cadastroDependente() {
        let { dependentes } = route.params;
        let vacinasUsuario = [];
        data.id.map((value, index) => {
            let objectVacina = {
                id: value,
                doses: data.doses[index],
                doseAtual: data.doseAtual[index],
            };
            vacinasUsuario.push(objectVacina);
        });
        depData = { ...dependentes, vacinas: vacinasUsuario };
        await cadDep(depData)
            .then(async ({ data }) => {
                console.log(data);
                const popStack = StackActions.pop(3);
                navigation.dispatch(popStack);
            })
            .catch((response) => console.log(response));
    }

    return (
        <View style={styles.container}>
            <Overlay
                isVisible={overlay}
                onBackdropPress={() => {
                    changeVisibility();
                    setConfirm(false);
                }}
                overlayStyle={styles.overlay}
            >
                {confirm ? (
                    <View style={styles.overlay}>
                        <Icon
                            name="question"
                            color="#2352FF"
                            size={24}
                            style={{ marginTop: 10 }}
                        />
                        <Text style={styles.overlayText1}>
                            Você tem certeza que está tudo correto?
                        </Text>
                        <Text style={styles.overlayText2}>
                            Muita atenção nessa parte!
                        </Text>

                        <Button
                            title="Sim"
                            type="clear"
                            containerStyle={styles.overlayButton}
                            titleStyle={styles.overlayButtonText}
                            onPress={cadastroDependente}
                        />
                        <Button
                            title="Não"
                            type="clear"
                            containerStyle={styles.overlayButton}
                            titleStyle={styles.overlayButtonText}
                            onPress={() => {
                                changeVisibility();
                                setConfirm(false);
                            }}
                        />
                    </View>
                ) : (
                    <View style={styles.overlay}>
                        <Icon
                            name="emotsmile"
                            color="#2352FF"
                            size={24}
                            style={{ marginTop: 10 }}
                        />
                        <Text style={styles.overlayText1}>
                            Certo, agora precisamos que você pegue a carteira de
                            vacinação do seu dependente e marque o número de
                            doses que você tem certeza que ele tomou de cada
                            vacina! Caso não tenha tomado nenhuma dose, deixe em
                            0!
                        </Text>
                        <Text style={styles.overlayText2}>
                            Muita atenção nessa parte!
                        </Text>

                        <Button
                            title="OK"
                            type="clear"
                            containerStyle={styles.overlayButton}
                            titleStyle={styles.overlayButtonText}
                            onPress={changeVisibility}
                        />
                    </View>
                )}
            </Overlay>

            <View>
                <FlatList
                    keyExtractor={(item) => item._id}
                    data={vacinas}
                    renderItem={({ item }) => (
                        <View style={styles.listView}>
                            <Text style={styles.title}>{item.nome}</Text>
                            <Text style={styles.description}>
                                {item.descricao}
                            </Text>
                            <Text style={styles.doses}>
                                Número de doses tomadas:
                            </Text>
                            <MarkSlider
                                value={0}
                                max={item.doses}
                                min={0}
                                marks={marks}
                                step={1}
                                style={styles.slider}
                                onChange={(value) =>
                                    marcaDoses(item._id, value)
                                }
                            />
                            <Divider />
                        </View>
                    )}
                    ListFooterComponent={() => (
                        <Button
                            title="Confirmar vacinas"
                            type="clear"
                            icon={() => (
                                <Icon
                                    name="check"
                                    color="#2352FF"
                                    size={24}
                                    style={{ marginRight: 10 }}
                                />
                            )}
                            onPress={() => {
                                changeConfirmation();
                                changeVisibility();
                            }}
                        />
                    )}
                />
            </View>
            <StatusBar
                style="auto"
                translucent={false}
                backgroundColor="#2352FF"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        justifyContent: "center",
        alignItems: "center",
        margin: 20,
    },
    overlayText1: {
        fontSize: 16,
        marginVertical: 15,
        textAlign: "center",
        color: "#555",
        marginHorizontal: 15,
    },
    overlayText2: {
        fontSize: 16,
        marginBottom: 15,
        textAlign: "center",
        fontWeight: "bold",
        color: "#555",
        marginHorizontal: 15,
    },
    overlayButtonContainer: {
        minWidth: 50,
    },
    overlayButtonText: {
        color: "#2352FF",
    },

    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    listView: {
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 5,
    },
    description: {
        fontSize: 14,
        color: "#555",
        fontStyle: "italic",
        marginBottom: 15,
    },
    doses: {
        fontSize: 15,
        fontWeight: "500",
    },
    slider: {
        marginBottom: 8,
        padding: 0,
    },
});