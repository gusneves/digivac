import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, AsyncStorage, FlatList, ScrollView, StatusBar, ActivityIndicator
} from "react-native";
import { Button, Divider } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';

import moment from 'moment';

import api from '../../services/api';

export default function Home() {
  const [, setUsuario] = useState({});
  const [vacinas, setVacinas] = useState({});
  const [nome, setNome] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [temVacinasProximas, setTemVacinasProximas] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    getUsuario();
  }, [isFocused]);

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
      const dataDoseVacinasDependentes = [];

      if (dependentesUsuario.length > 0) {
        dependentesUsuario.forEach(element => {
          for (let prop in element) {
            if (prop === 'nome') {
              nomeDependentes.push(element[prop]);
            }
            if (prop === 'vacinas') {
              vacinasDependentes.push(element[prop]);
              dosesAtuaisDependentesFinal.push(getDosesAtuaisDependentes(element[prop]));
              dataDoseVacinasDependentes.push(getDataDose(element[prop]));
            }
          }
        }
        );

        const idVacinasDependentes = [];
        const nomeVacinasDependentes = [];
        const dosesTotaisDependetes = [];

        for (let i = 0; i < vacinasDependentes.length; i++) {
          idVacinasDependentes.push(getIdVacinas(vacinasDependentes[i]));
          nomeVacinasDependentes.push(await getNomeVacinas(idVacinasDependentes[i]));
          dosesTotaisDependetes.push(await getDosesTotaisVacinas(idVacinasDependentes[i]));
        }

        const diferencaEntreDoses = getDosesFinais(dosesTotaisDependetes, dosesAtuaisDependentesFinal);

        // console.log(await juntaInfo(nomeDependentes, nomeVacinasDependentes, diferencaEntreDoses));
        setVacinas(await juntaInfo(nomeDependentes, nomeVacinasDependentes, diferencaEntreDoses, dataDoseVacinasDependentes));
        setLoading(false);
      } else {
        // console.log(await getArrayFinalUsuario());
        setVacinas(await getArrayFinalUsuario());
        setLoading(false);
      }

      function getDosesAtuaisDependentes(element) {
        const dosesAtuaisDependentes = [];

        for (let i = 0; i < element.length; i++) {
          dosesAtuaisDependentes.push(element[i].doseAtual);
        }

        return dosesAtuaisDependentes;
      }

      function getDataDose(element) {
        const dataDoseDependente = [];
  
        for (let i = 0; i < element.length; i++) {
          dataDoseDependente.push(element[i].dataDose);
        }
  
        return dataDoseDependente;
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
        const dataDoseVacinasUsuario = [];

        for (let i = 0; i < vacinasUsuario.length; i++) {
          dosesAtuaisVacinasUsuario.push(data.vacinas[i].doseAtual);
          dataDoseVacinasUsuario.push(data.vacinas[i].dataDose);
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
        const hoje = moment();
        const fimDoIntervalo = moment(hoje).add(1, 'M');
        // const fimDoIntervalo = moment(hoje).add(42, 'Y');

        let proxima = true;

        for (let j = 0; j < nomeVacinasUsuario.length; j++) {
          if (diferencas[j] === 0) {
            continue;
          }

          if (moment(dataDoseVacinasUsuario[j]).isBetween(hoje, fimDoIntervalo)) {
            arrayUsuarioFinal.push(criaObjetoVacinasUsuario(
              nomeUsuario, nomeVacinasUsuario[j], dataDoseVacinasUsuario[j], proxima
            ));
          } else {
            arrayUsuarioFinal.push(criaObjetoVacinasUsuario(
              nomeUsuario, nomeVacinasUsuario[j], dataDoseVacinasUsuario[j], !proxima
            ));
          }
        }

        return arrayUsuarioFinal;
      }

      function criaObjetoVacinasUsuario(nome, vacina, data, proxima) {
        let objeto = {
          nome,
          vacina,
          data,
          proxima
        };

        return objeto;
      }

      async function juntaInfo(arrayNomes, arrayNomeVacinas,
        diferencaEntreDoses,
        arrayDatas) {
        const arrayUsuarioFinal = await getArrayFinalUsuario();

        if (arrayNomes.length === 0) {
          return arrayUsuarioFinal;
        }

        let arrayVacinasFinal = [];

        for (let i = 0; i < arrayNomeVacinas.length; i++) {
          arrayVacinasFinal.push(getVacinasDeCadaDependente(
            arrayNomes[i], arrayNomeVacinas[i],
            diferencaEntreDoses[i],
            arrayDatas[i]))
        }

        const arrayDependentesFinal = [].concat.apply([], arrayVacinasFinal);

        function getVacinasDeCadaDependente(
          nomeDependente, arrayNomeVacinasDependente,
          diferencaEntreDoses, arrayDatas) {
          let objetoVacinasDependente = [];

          const hoje = moment();
          const fimDoIntervalo = moment(hoje).add(1, 'M');
          let proxima = true;

          for (let j = 0; j < arrayNomeVacinasDependente.length; j++) {
            if (diferencaEntreDoses[j] === 0) {
              continue;
            }

            if (moment(arrayDatas[j]).isBetween(hoje, fimDoIntervalo)) {
              objetoVacinasDependente.push(
                criaObjetoVacinas(
                  nomeDependente, arrayNomeVacinasDependente[j], arrayDatas[j], proxima
                )
              );
            } else {
              objetoVacinasDependente.push(
                criaObjetoVacinas(
                  nomeDependente, arrayNomeVacinasDependente[j], arrayDatas[j], !proxima
                )
              );
            }
          }

          return objetoVacinasDependente;
        }

        function criaObjetoVacinas(dependente, vacina, data, proxima) {
          let objeto = {
            nome: dependente,
            vacina,
            data,
            proxima
          };

          return objeto;
        }

        Array.prototype.push.apply(arrayUsuarioFinal, arrayDependentesFinal); // une os dois arrays no primeiro

        const arrayFinal = arrayUsuarioFinal;

        let resultado = 0;

        arrayFinal.map(item => {
          if (item.proxima) {
            resultado++;
          }
        });

        if (resultado > 0) {
          setTemVacinasProximas(true);
        }

        return arrayFinal;
      }
    } catch (e) {
      console.log(e);
    }
  }

  const string = 'O rotavírus é uma doença causada por sete tipos diferentes de sorotipos que são antigêncios diferentes, mas da mesma espécie microbiana. Porém, apenas três infectam o ser humano. Os principais sintomas são diarréia - que pode levar a desidratação -, vômitos e febre, além de problemas respiratórios, como coriza e tosse.' +
    '\nA transmissão pode ser fecal-oral ou seja, o vírus é eliminado nas fezes do paciente, contamina a água ou alimentos, e pode entrar em contato com a pessoa através das mãos.' +
    '\nAs principais medidas para evitar a rotavirose é a higiene das mãos, que pode ser feita com água e sabão ou álcool-gel, principalmente antes das refeições e após o banheiro. Além disso, ingerir sempre alimentos bem higienizados e água tratada é fundamental.';

  function getPrimeiroNome(nomeInteiro) {
    const primeiroNome = nomeInteiro.replace(/ .*/, ''); // RegEx que subistitui tudo depois do espaço por vazio

    return primeiroNome;
  }

  if (isLoading) {
    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: '#fff'
          }}
        >
          <ActivityIndicator size="large" color="#999" />
          <Text style={{ margin: 12, fontSize: 14, color: '#999' }}>Carregando informações...</Text>
        </View>
        <StatusBar
          barStyle="dark-content"
          translucent={false}
          backgroundColor="#FFF"
        />
      </>
    );
  }

  const renderItem = ({ item }) => temVacinasProximas ? (
    item.proxima && (
      <View style={styles.listItem}>
        <Text style={styles.name}>{getPrimeiroNome(item.nome)}</Text>
        <Text style={styles.vaccine}>{item.vacina}</Text>
        <Text style={styles.date}>{moment(item.data).format('DD/MM/YYYY')}</Text>
      </View>
    )
  ) : (
    <View style={styles.semVacinasProximas}>
      <Text style={styles.textSemVacinasProximas}>
        Beleza! Você não possui vacinas para tomar no próximo intervalo de 1 mês.
      </Text>
    </View>
  );

  const array = [0];

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Seja bem-vindo(a), {getPrimeiroNome(nome)}! 🏠</Text>
      <View style={styles.nextVaccines}>
        <Text style={styles.label}>Fique de olho nas próximas vacinas 💉</Text>
        <Divider style={{ backgroundColor: '#D3D3D3', height: 1 }} />
        <FlatList
          contentContainerStyle={styles.list}
          data={temVacinasProximas ? vacinas : array}
          keyExtractor={(item, index) => 'key' + index}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
        />
      </View>
      <View style={styles.learnMoreContainer}>
        <Text style={styles.learnMoreLabel}>Aprenda um pouco mais 📖</Text>
        <Divider style={{ backgroundColor: '#D3D3D3', height: 1 }} />
        <Text style={styles.learnMoreTitle}>Rotavírus humano</Text>
        <ScrollView style={styles.learnMoreText}>
          <Text style={styles.learnMore}>{string}</Text>
          <Button
            title='Veja mais ➜'
            type='clear'
            onPress={() => { }}
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

  semVacinasProximas: {
    width: 290,
    justifyContent: 'center',
    alignItems: 'center'
  },

  textSemVacinasProximas: {
    fontSize: 16,
    fontWeight: 'bold'
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
    flex: 1,
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

  learnMoreTitle: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: 10
  },

  learnMoreText: {
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 14,
    height: 295
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
