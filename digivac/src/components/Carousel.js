import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import api from '../../api/api';
import axios from 'axios'

export default class Carousel extends Component{
    
    state = {
        vacInfo:{},
        docs: []
    }

    loadVacinas = async() => {
        console.log('hello');
        await api.get('vacina', {
            id: '5f24133f5471aa2250b19062'
        });
        /*
        const response = await api.get('vacina');
        .then(function(response){
            //const {docs} = response.data;
            console.log(response.data);
            console.log(response.status);
            //this.setState({ docs: [...this.state.docs, ...docs]});
        });
        //this.setState({ docs: [...this.state.docs, ...docs]});
        */
    };

    componentDidMount() {
        this.loadVacinas();
    };

    renderItem = ({item}) => (
        <Box title={item.title} text={item.text} data={item.data}/>
    );

    render() {
        return (
            <View style={{padding:10}}>
               <FlatList data={this.state.docs}
               renderItem={this.renderItem}
               keyExtractor={item=>item._id}
               />
            </View>
        )
    }
}