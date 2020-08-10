import React, {Component} from 'react';
import {View, Text} from 'react-native';

export default class Perfil extends Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 18}}>Perfil</Text>
      </View>
    );
  }
}