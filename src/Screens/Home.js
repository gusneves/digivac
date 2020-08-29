import React, {Component} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import api from '../services/api';
import Box from '../components/Box'
import { TouchableOpacity } from 'react-native-gesture-handler';
//import Carousel from '../components/Carousel.js';

export default class Home extends Component {
  state = {
    vacInfo: [],
    refresh: false
  }

  loadVacinas = async() => {
      await api.get('vacina').then(response=>{

        const vacInfo = response.data
        console.log(vacInfo)
        this.setState({vacInfo: response.data});
        console.log(this.state.vacInfo)

      })
  };

  componentWillMount() {
      this.loadVacinas();
  };

  render() {
      return (
          <View style={{padding:10}}>
            <Text style={styles.titleVac}>Vacinas a serem tomadas:</Text>
            <FlatList 
            data={this.state.vacInfo}
            extraData={this.state.refresh}
            keyExtractor={item=>item._id}
            hotizontal
            renderItem={ ({ item }) => (
             
             <Box title={item.nome} text={item.descricao}
                  padding="2" height="60"/>
            ) }
            />
          </View>
      );
  }
}

const styles = StyleSheet.create({
  titleVac:{
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  }
})