import React, { useState, useEffect } from "react";
import { View, AsyncStorage, StyleSheet, FlatList, Text } from "react-native";
import { Button, Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { StatusBar } from "expo-status-bar";
import moment from "moment"; 

import api from "../../../services/api";

export default function Depedentes({ navigation }) {

  const [ dependentes, setDependentes ] = useState([]);

  useEffect(() => {
    getUserInfo()
  }, [])

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
                    keyExtractor={item => item.index}
                    data={dependentes}
                    renderItem={({item}) => {

                        let data_nasc = moment(item.data_nasc).format("DD/MM/YYYY")

                        return (
                        <View style={styles.listView}>
                            <Text style={ styles.nome }>
                              { item.nome }
                            </Text>
                            <Text style={ styles.data }>
                                { data_nasc }  
                            </Text>

                            <Divider />
                        </View>

                    )}}
                />
                <Button
                    title="Adicionar dependentes"
                    type="clear"
                    icon={() => (
                        <Icon
                            name="plus"
                            color="#2352FF"
                            size={24}
                            style={{ marginRight: 10 }}
                        />
                    )}
                    onPress={() => (
                        navigation.navigate("AddDependente")
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
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    listView: {
        padding: 10,
    },
    nome: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10
    },
    data:{
        fontSize: 14,
        color: "#555",
        fontStyle: "italic",
        marginBottom: 10
    },
});