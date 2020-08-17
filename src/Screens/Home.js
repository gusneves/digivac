import React, {Component} from 'react';
import {View, Text} from 'react-native';

export default class Home extends Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"#FFF"}}>
        <Text style={{fontSize: 18}}>Home</Text>
      </View>
    );
  }
}