import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { color } from 'react-native-reanimated';

export default class Box extends Component {
render(){
    return(
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>{this.props.title}</Text>
                <Text style={styles.text}>{this.props.text}</Text>
            </View>
        </View>
    )
}
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
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
    },
    title:{
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5
    },
    text:{

    }
})