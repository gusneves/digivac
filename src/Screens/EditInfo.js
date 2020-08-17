import React, {Component} from 'react';
import {View, Text} from 'react-native';

export default class EditInfo extends Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 18}}>Editar Informações</Text>
      </View>
    );
  }
}