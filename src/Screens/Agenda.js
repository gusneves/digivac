import React, {Component} from 'react';
import {View, Text} from 'react-native';

export default class Agenda extends Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 18}}>Agenda</Text>
      </View>
    );
  }
}