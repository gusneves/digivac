import React, {Component} from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, StyleSheet} from 'react-native';
import { ListItem, Avatar, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';


const list = [
  {
    title: "Editar informações",
    name: "EditInfo",
    icon: "pencil" 
  },
  {
    title: "Configurações",
    name: "Configs",
    icon: "settings" 
  },
  {
    title: "Adicionar dependentes",
    name: "Dependentes",
    icon: "plus" 
  },
  {
    title: "Sair",
    name: "Logout",
    icon: "logout" 
  },
]

export default class Perfil extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Avatar
          size="xlarge"
          rounded
          icon={{ name:'user', color:'#DDD', type: 'font-awesome'}}
          containerStyle={styles.avatar}
          onPress={() => console.log("FOI")}
        />
        <Text style={styles.username}>Username</Text>
        <Divider/>
        {
        list.map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            leftIcon={ () => (
                <Icon
                name={item.icon}
                color="#2352FF"
                size={22}
                />
              )
            }
            bottomDivider
            chevron
            titleStyle={styles.listText}
            onPress={ () => this.props.navigation.navigate(item.name)}
          />
        ))
        }

      <StatusBar style="auto" translucent={false} backgroundColor="#FFF"/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor:"#FFF"
  },
  avatar:{
    alignSelf: "center",
    marginTop: 25,
    marginBottom: 40,
    borderWidth: 0.5,
    borderColor: "#AAA"
  },
  username:{
    alignSelf: "center",
    textAlign: "center",
    fontSize: 18,
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 30
  },
  listText:{
    color: "#555"
  }
})