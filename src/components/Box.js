import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
<<<<<<< HEAD
=======
import StyleSheetFactory from '../styles/styles';
>>>>>>> e56f0a9... home pronta - falta atualizar agenda e vacinas a tomar
import { color } from 'react-native-reanimated';

export default class Box extends Component {
render(){
<<<<<<< HEAD
    return(
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>{this.props.title}</Text>
                <Text style={styles.text}>{this.props.text}</Text>
            </View>
        </View>
    )
=======
    let myStyleSheet = StyleSheetFactory.getSheet(this.props.padding, this.props.width,
        this.props.backColor, this.props.borderWidth, this.props.margin, this.props.borderRadius, this.props.borderColor,
        this.props.height)

    //se nao tiver rodape na box
    if(this.props.rodape == null){
    
        return(
            <View style={styles.container}>
                <View style={myStyleSheet.box}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={styles.text}>{this.props.text}</Text>
                </View>
            </View>
        )

    //se tiver rodape
    }else {

        return(
            <View style={styles.container}>
                <View style={myStyleSheet.box}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={styles.text}>{this.props.text}</Text>

                    <View style={styles.rodape}>
                        <Text style={styles.rodaText}>{this.props.rodape}</Text>
                    </View>

                </View>
            </View>
        )
    }
>>>>>>> e56f0a9... home pronta - falta atualizar agenda e vacinas a tomar
}
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
<<<<<<< HEAD
        alignItems: 'stretch',
        flexDirection: 'row'
    },
    box: {
        backgroundColor: "white",
        borderColor: 'black',
        borderWidth: 2,
        margin: 10,
        width: 150,
        padding: 10
=======
        flexDirection: 'row',
        padding: 4
>>>>>>> e56f0a9... home pronta - falta atualizar agenda e vacinas a tomar
    },
    title:{
        fontSize: 15,
        fontWeight: 'bold',
<<<<<<< HEAD
        marginBottom: 5
    },
    text:{

=======
        marginBottom: 5,
        color: "#555"
    },
    text:{

    },
    rodape:{
        display: "flex",
        justifyContent: 'flex-end',
        alignSelf: "flex-end"
>>>>>>> e56f0a9... home pronta - falta atualizar agenda e vacinas a tomar
    }
})