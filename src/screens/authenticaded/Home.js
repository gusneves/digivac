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

        const dependentesUsuario = data.dependentes;
        const nomeDependentes = [];
        const vacinasDependentes = [];
        const dosesAtuaisDependentesFinal = [];

        if (dependentesUsuario.length > 0) {
          dependentesUsuario.forEach(element => {
            for (let prop in element) {
              if (prop === 'nome') {
                nomeDependentes.push(element[prop]);
              }
              if (prop === 'vacinas') {
                vacinasDependentes.push(element[prop]);
                dosesAtuaisDependentesFinal.push(getDosesAtuaisDependentes(element[prop]));
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

          const dosesTotaisDependetes = [];

          for (let i = 0; i < idVacinasDependentes.length; i++) {
            dosesTotaisDependetes.push(await getDosesTotaisVacinas(idVacinasDependentes[i]));
          }

          const diferencaEntreDoses = getDosesFinais(dosesTotaisDependetes, dosesAtuaisDependentesFinal);

          // console.log(await juntaInfo(nomeDependentes, nomeVacinasDependentes, diferencaEntreDoses));
          setVacinas(await juntaInfo(nomeDependentes, nomeVacinasDependentes, diferencaEntreDoses));
        } else {
          // console.log(await getArrayFinalUsuario());
          setVacinas(await getArrayFinalUsuario());
        }

        function getDosesAtuaisDependentes(element) {
          const dosesAtuaisDependentes = [];

          for (let i = 0; i < element.length; i++) {
            dosesAtuaisDependentes.push(element[i].doseAtual);
          }

          return dosesAtuaisDependentes;
        }

        function getDosesFinais(dosesTotais, dosesAtuais) {
          const dosesFinais = [];

          for (let i = 0; i < dosesTotais.length; i++) {
            dosesFinais.push(getDosesAux(dosesTotais[i], dosesAtuais[i]));
          }

          return dosesFinais;
        }

        function getDosesAux(dosesTotais, dosesAtuais) {
          const dosesAux = [];

          for (let i = 0; i < dosesTotais.length; i++) {
            if (dosesTotais[i] - dosesAtuais[i] > 0) {
              dosesAux.push(dosesTotais[i] - dosesAtuais[i]);
            } else {
              dosesAux.push(0);
            }
          }

          return dosesAux;
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

        async function getDosesTotaisVacinas(idVacinas) {
          const dosesTotaisVacinas = [];

          for (let i = 0; i < idVacinas.length; i++) {
            let dataVacinas = await api.get(`/vacina/${idVacinas[i]}`);

            dosesTotaisVacinas.push(dataVacinas.data.doses);
          }

          return dosesTotaisVacinas;
        }

        async function getArrayFinalUsuario() {
          const nomeUsuario = data.nome;
          const vacinasUsuario = data.vacinas;

          const dosesAtuaisVacinasUsuario = [];

          for (let i = 0; i < data.vacinas.length; i ++) {
            dosesAtuaisVacinasUsuario.push(data.vacinas[i].doseAtual);
          }

          let idVacinasUsuario = [];

          idVacinasUsuario = getIdVacinas(vacinasUsuario);

          const nomeVacinasUsuario = [];
          const dosesTotaisVacinasUsuario = [];

          for (const id of idVacinasUsuario) {
            let dataVacinasUsuario = await api.get(`/vacina/${id}`);

            nomeVacinasUsuario.push(dataVacinasUsuario.data.nome);
            dosesTotaisVacinasUsuario.push(dataVacinasUsuario.data.doses);
          }

          const diferencas = [];

          for (let i = 0; i < dosesTotaisVacinasUsuario.length; i++) {
            if (dosesTotaisVacinasUsuario[i] - dosesAtuaisVacinasUsuario[i] === 0) {
              diferencas.push(0);
            } else {
              diferencas.push(dosesTotaisVacinasUsuario[i] - dosesAtuaisVacinasUsuario[i]);
            }
          }

          const arrayUsuarioFinal = [];
          
          for (let i = 0; i < nomeVacinasUsuario.length; i++) {
            if (diferencas[i] === 0) {
              continue;
            }

            arrayUsuarioFinal[i] = {
              nome: nomeUsuario,
              vacina: nomeVacinasUsuario[i],
              data: '15/10/2020'
            }; 
          }
           
          return arrayUsuarioFinal;
        }

        async function juntaInfo(arrayNomes, arrayNomeVacinas, diferencaEntreDoses, arrayDatas = '15/10/2020') {    
          const arrayUsuarioFinal = await getArrayFinalUsuario();

          if (arrayNomes.length === 1) {
            return arrayUsuarioFinal;
          }

          let arrayVacinasFinal = [];

          for (let i = 0; i < arrayNomeVacinas.length; i++) {
            arrayVacinasFinal.push(getVacinasDeCadaDependente(arrayNomes[i], arrayNomeVacinas[i], diferencaEntreDoses[i], arrayDatas))
          }

          const arrayDependentesFinal = [].concat.apply([], arrayVacinasFinal);

          function getVacinasDeCadaDependente(nomeDependente, arrayNomeVacinasDependente, diferencaEntreDoses, arrayDatas) {
            let objetoVacinasDependente = [];
            
            for (let j = 0; j < arrayNomeVacinasDependente.length; j++) {
              if (diferencaEntreDoses[j] === 0) {
                continue;
              }

              objetoVacinasDependente.push(
                criaObjetoVacinas(nomeDependente, arrayNomeVacinasDependente[j], arrayDatas));
            }

            return objetoVacinasDependente;
          }

          function criaObjetoVacinas(dependente, vacina, data) {
            let objeto = {
              nome: dependente,
              vacina,
              data
            };

            return objeto;
          }

          Array.prototype.push.apply(arrayUsuarioFinal, arrayDependentesFinal); // une os dois arrays no primeiro
          
          const arrayFinal = arrayUsuarioFinal;
          
          return arrayFinal;
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
          keyExtractor={(item, index) => 'key' + index}
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
              onPress={() => {}}
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
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center'
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
    paddingRight: 6,
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
