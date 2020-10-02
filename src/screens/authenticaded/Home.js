import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, AsyncStorage, FlatList, ScrollView, StatusBar } from "react-native";
import { Button } from 'react-native-elements';

import api from '../../services/api';

export default function Home({ navigation }) {
  const [, setUsuario] = useState({});
  const [vacinas, setVacinas] = useState({});
  const [nome, setNome] = useState('');

  useEffect(() => {
    async function getUsuario() {
      try {
        const id = await AsyncStorage.getItem('usuario');
        const { data } = await api.get(`/usuario/${id}`);
        
        setUsuario(data);
        setNome(data.nome);

        const vacinasUsuario = data.vacinas;
        const idVacinasUsuario = [];

        vacinasUsuario.forEach(element => {
          for (let prop in element) {
            if (prop === 'id') {
              idVacinasUsuario.push(element[prop]);
            }
          }
        });

        const nomeVacinasUsuario = [];

        for (const id of idVacinasUsuario) {
          let dataVacinasUsuario = await api.get(`/vacina/${id}`);

          nomeVacinasUsuario.push(dataVacinasUsuario.data.nome);
        }

        const arrayVacinasFinais = [{}]; 
        for (let i = 0; i < idVacinasUsuario.length; i++) {
          arrayVacinasFinais[i] = {
            nome: data.nome,
            vacina: nomeVacinasUsuario[i],
            data: 'Até o fim de 2020'
          }; 
        }
        setVacinas(arrayVacinasFinais);
      } catch (e) {
        console.log(e);
      }
    }
    async function getVacinas() {
      try {
        const { data } = await api.get('/vacina');
  
        setVacinas(data);
      } catch (e) {
        console.log(e);
      }
    }

    getUsuario();
    getVacinas();
  }, []);

  const string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Tempus egestas sed sed risus pretium. Cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla. Sollicitudin nibh sit amet commodo nulla. Id venenatis a condimentum vitae sapien pellentesque. Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat. Malesuada proin libero nunc consequat interdum. Velit dignissim sodales ut eu sem integer vitae justo eget. Vehicula ipsum a arcu cursus.';

  const nomeInteiro = nome;
  const primeiroNome = nomeInteiro.replace(/ .*/,''); // RegEx que subistitui tudo depois do espaço por vazio

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Seja bem-vindo(a), {primeiroNome}! 🏠</Text>
      <View style={styles.nextVaccines}>
        <Text style={styles.label}>Fique de olho nas próximas vacinas 💉</Text>
        <View style={styles.hr1}></View>
        <FlatList 
          contentContainerStyle={styles.list}
          data={Object.keys(vacinas)}
          keyExtractor={vacina => vacina.id}
          horizontal 
          showsHorizontalScrollIndicator={false} 
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.name}>{vacinas[item].nome}</Text>
              <Text style={styles.vaccine}>{vacinas[item].vacina}</Text>
              <Text style={styles.date}>{vacinas[item].data}</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.learnMoreContainer}>
        <Text style={styles.learnMoreLabel}>Aprenda um pouco mais 📖</Text>
        <View style={styles.hr2}></View>
        <ScrollView style={styles.learnMoreText}>
            <Text style={styles.learnMore}>{string}</Text>
            <Button 
              title='Veja mais ➜'
              type='clear'
              onPress={() => {
                // navigation.navigate('Agenda', )
              }}
              buttonStyle={styles.learnMoreButton}
              titleStyle={styles.learnMoreButtonText}
            />
        </ScrollView>
        <StatusBar
          barStyle="dark-content"
          translucent={false}
          backgroundColor="#FFF"
        />
      </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#FFF',
  },
  
  welcome: {
    margin: 20,
    marginTop: 30,
    fontWeight: 'bold',
    fontSize: 16
  },

  nextVaccines: {
    marginHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 4,
    backgroundColor: '#fafafa'
  },

  label: {
    marginLeft: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 14,
  },

  hr1: {
    borderWidth: 0.25,
    borderBottomColor: '#D3D3D3'
  },

  list: {
    flexGrow: 0,
    height: 100,
    paddingLeft: 14,
    marginTop: 10
  },
  
  listItem: {
    flexWrap: 'wrap',
    marginRight: 8,
    borderWidth: 0.5,
    borderColor: '#66e0ff',
    borderRadius: 5,
    backgroundColor: '#2352FF',
  },
  
  name: {
    color: '#fff',
    paddingTop: 8,
    paddingHorizontal: 10,
    fontSize: 14,
  },

  vaccine: {
    color: '#fff',
    paddingTop: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold'
  },

  date: {
    color: '#fff',
    paddingTop: 8,
    paddingHorizontal: 10,
    fontSize: 14
  },

  learnMoreContainer: {
    margin: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 4,
    backgroundColor: '#fafafa',
    borderWidth: 1,
  },
  
  learnMoreLabel: {
    marginLeft: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 14
  },
  
  hr2: {
    borderWidth: 0.35,
    borderBottomColor: '#D3D3D3'
  },

  learnMoreText: {
    marginVertical: 10,
    marginHorizontal: 14,
    height: 314
  },

  learnMore: {
    fontSize: 15,
    textAlign: 'justify'
  },

  learnMoreButton: {
    alignSelf: 'flex-end',
    width: 110
  },

  learnMoreButtonText: {
    fontSize: 14,
    color: '#2352FF'
  }
});
