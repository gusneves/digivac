import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, StyleSheet, AsyncStorage } from "react-native";
import { ListItem, Avatar, Divider } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/SimpleLineIcons";

import api from "../../services/api";
import { SessionContext } from "../../context/Session";

const list = [
    {
        title: "Editar informações",
        name: "EditInfo",
        icon: "pencil",
    },
    {
        title: "Configurações",
        name: "Configs",
        icon: "settings",
    },
    {
        title: "Dependentes",
        name: "Dependentes",
        icon: "people",
    },
    {
        title: "Sair",
        name: "Logout",
        icon: "logout",
    },
];

export default function Perfil({ navigation }) {
    const [image, useImage] = useState(null);
    const [user, useUser] = useState({});

    const { signOut } = useContext(SessionContext);

    useEffect(() => {
        _getImage();
    }, [image, user]);

    useEffect(() => {
        getPermissionAsync();
        getUserInfo();
    }, []);

    async function getUserInfo() {
        const id = await AsyncStorage.getItem("usuario");
        await api
            .get("/usuario/" + id)
            .then((response) => {
                useUser(response.data);
            })
            .catch((e) => {
                console.log("Erro ao pegar dados do usuário" + e);
            });
    }

    async function getPermissionAsync() {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(
                Permissions.CAMERA_ROLL
            );
            if (status !== "granted") {
                alert(
                    "Desculpe, precisamos da autorização para fazer isso funcionar!"
                );
            }
        }
    }

    async function _pickImage() {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });
            if (!result.cancelled) {
                useImage(result.uri);
                FileSystem.copyAsync({
                    from: result.uri,
                    to:
                        FileSystem.documentDirectory +
                        `assets/${user._id}/` +
                        Date.now() +
                        ".jpg",
                });
            }
            console.log(result);
        } catch (E) {
            console.log(E);
        }
    }

    async function _getImage() {
        const dir = FileSystem.documentDirectory + `assets/${user._id}/`;
        await FileSystem.getInfoAsync(dir)
            .then(async () => {
                const images = await FileSystem.readDirectoryAsync(dir);
                let lastItem = images[images.length - 1];
                if (images != null) useImage("" + dir + lastItem);
            })
            .catch(async () => {
                await FileSystem.makeDirectoryAsync(dir);
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <Avatar
                size="xlarge"
                rounded
                icon={{ name: "user", color: "#DDD", type: "font-awesome" }}
                placeholderStyle={{backgroundColor: "#FFF"}}
                source={{ uri: image }}
                activeOpacity={0.5}
                containerStyle={styles.avatar}
                onPress={_pickImage}
                onAccessoryPress={_pickImage}
                showAccessory={true}
                accessory={{
                    name: "camera",
                    underlayColor: "#2020FA",
                    type: "font-awesome",
                    size: 40,
                    style: { backgroundColor: "#2352FA" },
                    iconProps: { size: 20, color: "#FFF" },
                }}
            />

            <Text style={styles.username}>{user.nome}</Text>
            <Divider />
            {list.map((item, i) => (
                <ListItem
                    key={i}
                    title={item.title}
                    leftIcon={() => (
                        <Icon name={item.icon} color="#2352FF" size={22} />
                    )}
                    bottomDivider
                    chevron
                    titleStyle={styles.listText}
                    onPress={() =>
                        item.name === "Logout"
                            ? signOut()
                            : navigation.navigate(item.name)
                    }
                />
            ))}

            <StatusBar
                style="auto"
                translucent={false}
                backgroundColor="#FFF"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    avatar: {
        alignSelf: "center",
        marginTop: 25,
        marginBottom: 35,
        borderWidth: 0.5,
        borderColor: "#AAA",
    },
    username: {
        alignSelf: "center",
        textAlign: "center",
        fontSize: 18,
        marginRight: 15,
        marginLeft: 15,
        marginBottom: 30,
    },
    listText: {
        color: "#555",
    },
});
