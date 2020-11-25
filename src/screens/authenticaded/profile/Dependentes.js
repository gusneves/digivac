import React, { useState, useEffect } from "react";
import { View, AsyncStorage, StyleSheet, FlatList, Text, StatusBar, TouchableOpacity } from "react-native";
import { Button, Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import moment from "moment";

import api from "../../../services/api";
import EditDependente from "./cadDependente/EditDependente";

export default function Depedentes({ navigation }) {
    const [dependentes, setDependentes] = useState([]);

    useEffect(() => {
        getUserInfo();
    }, []);

    async function getUserInfo() {
        const id = await AsyncStorage.getItem("usuario");
        await api
            .get("/usuario/" + id)
            .then((response) => {
                setDependentes(response.data.dependentes);
            })
            .catch((e) => {
                console.log("Erro ao pegar dados do usuário" + e);
            });
    }

    return (
        <View style={styles.container}>
            <View>
                <FlatList
                    keyExtractor={(item) => item._id}
                    on
                    data={dependentes}
                    renderItem={({ item }) => {
                        let data_nasc = moment(item.data_nasc).format(
                            "DD/MM/YYYY"
                        );

                        return (
                            <>
                                <TouchableOpacity style={styles.listView} onPress={() => navigation.navigate("EditDependente", { dep: item })} >
                                    <View style={{ flex: 3 }}>
                                        <Text style={styles.nome}>
                                            {item.nome}
                                        </Text>
                                        <Text style={styles.data}>
                                            {data_nasc}
                                        </Text>
                                    </View>
                                    {item.sexo === "Masculino" ? (
                                        <View style={{ alignSelf: "center" }}>
                                            <Icon
                                                name="user"
                                                color="#BBB"
                                                size={24}
                                                style={{
                                                    marginRight: 10,
                                                    color: "#182647AA",
                                                }}
                                            />
                                        </View>
                                    ) : (
                                        <View style={{ alignSelf: "center" }}>
                                            <Icon
                                                name="user-female"
                                                color="#BBB"
                                                size={24}
                                                style={{
                                                    marginRight: 10,
                                                    color: "#182647AA",
                                                }}
                                            />
                                        </View>
                                    )}
                                </TouchableOpacity>

                                <Divider />
                            </>
                        );
                    }}
                    ListFooterComponent={() => (
                        <Button
                            title="Adicionar dependente"
                            type="clear"
                            icon={() => (
                                <Icon
                                    name="plus"
                                    color="#2352FF"
                                    size={24}
                                    style={{ marginRight: 10 }}
                                />
                            )}
                            containerStyle={{ margin: 10 }}
                            onPress={() => navigation.navigate("AddDependente")}
                        />
                    )}
                />
            </View>

            <StatusBar
                barStyle="light-content"
                translucent={false}
                backgroundColor="#2352FF"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 50,
        backgroundColor: "#FFF",
    },
    listView: {
        flexDirection: "row",
        padding: 10,
    },
    nome: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    data: {
        fontSize: 14,
        color: "#555",
        fontStyle: "italic",
        marginBottom: 10,
    },
});
