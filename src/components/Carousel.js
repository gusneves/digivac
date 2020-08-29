import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import api from '../services/api';

class Carousel extends Component{
    
    state = {
        vacInfo: {}
    }

    loadVacinas = async() => {
        const response = await api.get('vacina')

        const {...vacInfo} = response.data
        
        this.setState({vacInfo});
        console.log(this.state.vacInfo)
    };

    componentDidMount() {
        this.loadVacinas();
    };

    renderItem(item) {
        console.log(item)
        return (
        <Text key={item._id}>{item.nome}</Text>
        )
    }

    render() {
        return (
            <View style={{padding:10}}>
               <FlatList data={this.state.vacInfo}
               keyExtractor={item=>item._id}
               renderItem={({item}) => this.renderItem({item})}
               />
               
            </View>
        );
    }
}

export default Carousel