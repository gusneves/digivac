import React, { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, StyleSheet, Image } from "react-native";
import { ListItem, Avatar, Divider } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/SimpleLineIcons";

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
    title: "Adicionar dependentes",
    name: "Dependentes",
    icon: "plus",
  },
  {
    title: "Sair",
    name: "Logout",
    icon: "logout",
  },
];

export default class Perfil extends Component {
  state = {
    image: null,
  };

  render() {
    let { image } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Avatar
          size="xlarge"
          rounded
          icon={{ name: "user", color: "#DDD", type: "font-awesome" }}
          source={{ uri: image }}
          activeOpacity={0.5}
          containerStyle={styles.avatar}
          onPress={this._pickImage}
          onAccessoryPress={this._pickImage}
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

        <Text style={styles.username}>Username</Text>
        <Divider />
        {list.map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            leftIcon={() => <Icon name={item.icon} color="#2352FF" size={22} />}
            bottomDivider
            chevron
            titleStyle={styles.listText}
            onPress={() => this.props.navigation.navigate(item.name)}
          />
        ))}

        <StatusBar style="auto" translucent={false} backgroundColor="#FFF" />
      </SafeAreaView>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
    this._getImage();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Desculpe, precisamos da autorização para fazer isso funcionar!");
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
        FileSystem.copyAsync({
          from: result.uri,
          to: FileSystem.documentDirectory + "assets/" + Date.now() + ".jpg",
        });
      }
      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  _getImage = async () => {
    let dir = FileSystem.documentDirectory + "assets/";
    const images = await FileSystem.readDirectoryAsync(dir);
    let lastItem = images[images.length - 1];
    if (images != null) this.setState({ image: "" + dir + lastItem });
    console.log();
  };
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
