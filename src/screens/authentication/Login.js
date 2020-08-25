import React, { useState, useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import logo from '../../assets/logo.png';

import { SessionContext } from '../../context/Session';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useContext(SessionContext);

  function handleSubmmit() {
    signIn(email, password);
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo}/>

      <View style={styles.form}>
        <Text style={styles.label}>SEU E-MAIL *</Text>
        <TextInput
          style={styles.input}
          placeholder='Seu e-mail'
          placeholderTextColor='#999'
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>SUA SENHA *</Text>
        <TextInput
          style={styles.input}
          placeholder='Sua senha'
          placeholderTextColor='#999'
          autoCapitalize='none'
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={handleSubmmit} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('Cadastro') }} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Ainda não possui cadastro?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 180,
    height: 150,
    resizeMode: 'contain',
  },

  form: {
    alignSelf: 'stretch',
    marginTop: 30,
    paddingHorizontal: 28
  },

  label: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },

  input: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    fontSize: 16,
    height: 40,
    marginBottom: 16
  },

  button: {
    marginTop: 10,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#000',
    height: 45,
    backgroundColor: '#6afea8',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  registerButton: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  registerButtonText: {
    fontSize: 16,
    color: '#45a16b',
  }
});