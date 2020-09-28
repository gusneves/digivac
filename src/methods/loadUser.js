import React, {Component, useState, useEffect} from 'react';
import api from '../services/api';
import { AsyncStorage } from 'react-native';

export default async function loadUser(){
    
    const userId = await AsyncStorage.getItem('usuario');
    const userData = await api.get(`/usuario/${userId}`);

    return userData.data
}