import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, AsyncStorage, FlatList, ScrollView, StatusBar } from "react-native";
import { Button } from 'react-native-elements';
import { array } from "yup";

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

        const dependentesUsuario = data.dependentes;
        const nomeDependentes = [];
        const vacinasDependentes = [];

        if (dependentesUsuario.length > 0) {
          dependentesUsuario.forEach(element => {
            for (let prop in element) {
              if (prop === 'nome') {
                nomeDependentes.push(element[prop]);
              }
              if (prop === 'vacinas') {
                vacinasDependentes.push(element[prop]);
                }
              }
            }
          );

          const idVacinasDependentes = [];

          for (let i = 0; i < vacinasDependentes.length; i++) {
            idVacinasDependentes.push(getIdVacinas(vacinasDependentes[i]));
          }
          
          const nomeVacinasDependentes = [];

          for (let i = 0; i < idVacinasDependentes.length; i++) {
            nomeVacinasDependentes.push(await getNomeVacinas(idVacinasDependentes[i]));
          }

          // setVacinas(juntaInfo(nomeDependentes, nomeVacinasDependentes));

          // console.log(nomeVacinasDependentes);
          console.log(juntaInfo(nomeDependentes, nomeVacinasDependentes));
        } else {
          const nomeArray = [nome];
          const vacinasUsuario = data.vacinas;
          let idVacinasUsuario = [];

          idVacinasUsuario = getIdVacinas(vacinasUsuario);

          const nomeVacinasUsuario = [];

          for (const id of idVacinasUsuario) {
            let dataVacinasUsuario = await api.get(`/vacina/${id}`);

            nomeVacinasUsuario.push(dataVacinasUsuario.data.nome);
          }

          setVacinas(juntaInfo(nomeArray, nomeVacinasUsuario));

          console.log(juntaInfo(nomeArray, nomeVacinasUsuario));
        }

        function getIdVacinas(arrayVacinas) {
          const idVacinas = [];
        
          arrayVacinas.forEach(element => {
            for (let prop in element) {
              if (prop === 'id') {
                idVacinas.push(element[prop]); 
              }
            }
          });
        
          return idVacinas;
        }
        
        async function getNomeVacinas(idVacinas) {
          const nomeVacinas = [];

          for (let i = 0; i < idVacinas.length; i++) {
            let dataVacinas = await api.get(`/vacina/${idVacinas[i]}`);

            nomeVacinas.push(dataVacinas.data.nome);
          }

          return nomeVacinas;
        }

        function juntaInfo(arrayNomes, arrayNomeVacinas, arrayDatas = '15/10/2020') {          
          let arrayNomeVacinasFinal = [];
          let vacinasMesmoDependente = 0;
          let vacinasUnicas = 0;
          let nomeDependenteMaisDeUmaVacina;

          for (let i = 0; i < arrayNomeVacinas.length; i++) {
            if (arrayNomeVacinas[i].length > 1) {
              nomeDependenteMaisDeUmaVacina = arrayNomes[i];
              // nomeDependenteMaisDeUmaVacina.push(arrayNomes[i]);
              for (let j = 0; j < arrayNomeVacinas[i].length - 1; j++) {
                for (let k = 0; k < arrayNomeVacinas[j].length; k++) {
                  arrayNomeVacinasFinal.push(arrayNomeVacinas[j][k]);
                  vacinasMesmoDependente++;
                }
              }
            } else {
              vacinasUnicas++;
            }
          }

          const arrayMaisDeUmaVacina = [{}];
          
          for (let i = 0; i < arrayNomeVacinasFinal.length; i++) {
            arrayMaisDeUmaVacina[i] = {
              nome: nomeDependenteMaisDeUmaVacina[0],
              vacinas: arrayNomeVacinasFinal[i],
              data: arrayDatas
            }
          }

          const vacinasTotais = vacinasMesmoDependente + vacinasUnicas;

          const arrayUmaVacina = [{}];

          // for (let i = 0; i < arrayNomeVacinas.length; i++) {
          //   arrayUmaVacina[i] = {
          //     nome: arrayNomes[i],
          //     vacina: arrayNomeVacinas[i],
          //     data: arrayDatas
          //   }
          // }
          
          return arrayMaisDeUmaVacina;
        }
    } catch (e) {
        console.log(e);
      }
    }

    getUsuario();
  }, []);

  const string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Tempus egestas sed sed risus pretium. Cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla. Sollicitudin nibh sit amet commodo nulla. Id venenatis a condimentum vitae sapien pellentesque. Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat. Malesuada proin libero nunc consequat interdum. Velit dignissim sodales ut eu sem integer vitae justo eget. Vehicula ipsum a arcu cursus.';

  function getPrimeiroNome(nomeInteiro) {
    const primeiroNome = nomeInteiro.replace(/ .*/,''); // RegEx que subistitui tudo depois do espaço por vazio

    return primeiroNome;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Seja bem-vindo(a), {getPrimeiroNome(nome)}! 🏠</Text>
      <View style={styles.nextVaccines}>
        <Text style={styles.label}>Fique de olho nas próximas vacinas 💉</Text>
        <View style={styles.hr1}></View>
        <FlatList 
          contentContainerStyle={styles.list}
          data={Object.keys(vacinas)}
          keyExtractor={vacina => vacina._id}
          horizontal 
          showsHorizontalScrollIndicator={false} 
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.name}>{getPrimeiroNome(vacinas[item].nome)}</Text>
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
