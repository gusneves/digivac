import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, StyleSheet, StatusBar, FlatList, ActivityIndicator, AsyncStorage, TouchableOpacity, RefreshControl
} from 'react-native';
import { Divider } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/SimpleLineIcons'

import moment from 'moment';

import { CarteiraContext } from '../context/Carteira';

import api from '../services/api';

export default function ListaVacinas({ route, navigation }) {
  const [nomePessoa, setNomePessoa] = useState();
  const [vacinas, setVacinas] = useState();
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);

  const { carteiraInfo, setCarteiraInfo } = useContext(CarteiraContext);

  useEffect(() => {
    getVacinas();
  }, []);

  async function getVacinas() {
    let objetoPessoa;

    if (Object.keys(carteiraInfo).length !== 0) {
      objetoPessoa = carteiraInfo;
    } else {
      objetoPessoa = route.params.info;
    }

    const _id = objetoPessoa._id;
    const nome = objetoPessoa.nome;
    setNomePessoa(nome);

    const arrayVacinas = objetoPessoa.vacinas;

    const idVacinas = [];
    const _idVacinas = [];
    const doseAtual = [];
    const dataDose = [];

    for (let i = 0; i < arrayVacinas.length; i++) {
      idVacinas.push(arrayVacinas[i].id);
      _idVacinas.push(arrayVacinas[i]._id);
      doseAtual.push(arrayVacinas[i].doseAtual);
      dataDose.push(arrayVacinas[i].dataDose);
    }

    const nomeVacinas = [];
    const descricaoVacinas = [];
    const dosesTotais = [];

    for (let i = 0; i < idVacinas.length; i++) {
      nomeVacinas.push(await getNomeVacinas(idVacinas[i]));
      descricaoVacinas.push(await getDescricaoVacinas(idVacinas[i]));
      dosesTotais.push(await getDosesTotaisVacinas(idVacinas[i]));
    }

    const diferenca = getDosesFinais(dosesTotais, doseAtual);

    const arrayVacinasPendentes = [];
    const arrayVacinasTomadas = [];

    let pendente = true;

    for (let j = 0; j < nomeVacinas.length; j++) {
      let vacinaTomada = false;

      if (diferenca[j] === 0) {
        vacinaTomada = true;

        arrayVacinasTomadas.push(
          criaObjetoVacinas(
            _id, nome,
            _idVacinas[j], nomeVacinas[j], descricaoVacinas[j],
            doseAtual[j], dosesTotais[j], dataDose[j],
            vacinaTomada,
          )
        );
      } else {
        if (moment(dataDose[j]).isBefore()) {
          arrayVacinasPendentes.push(
            criaObjetoVacinas(
              _id, nome,
              _idVacinas[j], nomeVacinas[j], descricaoVacinas[j],
              doseAtual[j], dosesTotais[j], dataDose[j],
              vacinaTomada, pendente
            )
          );
        } else {
          arrayVacinasPendentes.push(
            criaObjetoVacinas(
              _id, nome,
              _idVacinas[j], nomeVacinas[j], descricaoVacinas[j],
              doseAtual[j], dosesTotais[j], dataDose[j],
              vacinaTomada, !pendente
            )
          );
        }
      }
    }

    Array.prototype.push.apply(arrayVacinasPendentes, arrayVacinasTomadas)

    const arrayVacinasFinal = arrayVacinasPendentes;

    setVacinas(arrayVacinasFinal);
    setCarteiraInfo([]);
    setLoading(false);
  }

  function criaObjetoVacinas(
    _id, nome,
    _idVacina, vacina, descricao,
    doseAtual, doseTotal, dataDose,
    vacinaTomada, pendente) {
    let objeto = {
      _id,
      nome,
      vacina,
      _idVacina,
      descricao,
      doseAtual,
      doseTotal,
      dataDose,
      vacinaTomada,
      pendente
    };

    return objeto;
  }

  function getDosesFinais(dosesTotais, dosesAtuais) {
    const dosesFinais = [];

    for (let i = 0; i < dosesTotais.length; i++) {
      if (dosesTotais[i] - dosesAtuais[i] > 0) {
        dosesFinais.push(dosesTotais[i] - dosesAtuais[i]);
      } else {
        dosesFinais.push(0);
      }
    }

    return dosesFinais;
  }

  async function getNomeVacinas(idVacinas) {
    const dataVacinas = await api.get(`/vacina/${idVacinas}`);

    const nome = dataVacinas.data.nome;

    return nome;
  }

  async function getDescricaoVacinas(idVacinas) {
    const dataVacinas = await api.get(`/vacina/${idVacinas}`);

    const descricao = dataVacinas.data.descricao;

    return descricao;
  }

  async function getDosesTotaisVacinas(idVacinas) {
    const dataVacinas = await api.get(`/vacina/${idVacinas}`);

    const doses = dataVacinas.data.doses;

    return doses;
  }

  function getPrimeiroNome(nomeInteiro) {
    const primeiroNome = nomeInteiro.replace(/ .*/, ''); // RegEx que subistitui tudo depois do espaço por vazio

    return primeiroNome;
  }

  const onRefresh = async () => {
    setRefreshing(true);
    if (Object.keys(carteiraInfo).length !== 0) {
      await getVacinas();
    }
    setRefreshing(false);
  }

  if (isLoading) {
    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: '#fff',
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

  const renderItem = ({ item }) => !item.vacinaTomada ? (
    item.pendente ? (
      <View style={styles.vacinaPendenteContainer}>
        <Text style={styles.nomeVacina}>{item.vacina}</Text>
        <Divider style={styles.dividerVacinaPendente} />
        <Text style={styles.doses}>Dose: {item.doseAtual}/{item.doseTotal}</Text>
        <Text style={styles.descricaoVacina}>Descrição: {item.descricao} </Text>
        <Text style={styles.dataVacina}>Data: {moment(item.dataDose).format('DD/MM/YYYY')}</Text>
        <Text style={styles.dataVacinaPendente}>Atenção: essa vacina está atrasada!</Text>
        <TouchableOpacity
          style={styles.buttonPendente}
          onPress={() => navigation.navigate('QRCodeScanner', {
            _idPessoa: item._id,
            _idVacina: item._idVacina,
            doseAtual: item.doseAtual,
          })}
        >
          <Text style={styles.textPendenteButton}>Marcar dose como tomada</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={styles.vacinaContainer}>
        <Text style={styles.nomeVacina}>{item.vacina}</Text>
        <Divider style={styles.divider} />
        <Text style={styles.doses}>Dose: {item.doseAtual}/{item.doseTotal}</Text>
        <Text style={styles.descricaoVacina}>Descrição: {item.descricao} </Text>
        <Text style={styles.dataVacina}>Data: {moment(item.dataDose).format('DD/MM/YYYY')}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('QRCodeScanner', {
            _idPessoa: item._id,
            _idVacina: item._idVacina,
            doseAtual: item.doseAtual,
          })}
        >
          <Text style={styles.textButton}>Marcar dose como tomada</Text>
        </TouchableOpacity>
      </View>
    )
  ) : (
      <View style={styles.vacinaTomadaContainer}>
        <Text style={styles.nomeVacinaTomada}>{item.vacina}</Text>
        <Divider style={styles.dividerVacinaTomada} />
        <Text style={styles.dosesTomadas}>Dose: {item.doseAtual}/{item.doseTotal}</Text>
        <Text style={styles.descricaoVacinaTomada}>Descrição: {item.descricao} </Text>
        <Text style={styles.dataVacinaTomada}>Todas as doses foram tomadas!</Text>
      </View>
    );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name='menu' size={25} onPress={() => { navigation.openDrawer() }} />
          <Text style={styles.label}>Agenda de {getPrimeiroNome(nomePessoa)} 📅</Text>
        </View>

        <FlatList
          data={vacinas}
          keyExtractor={item => item._id + item._idVacina}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        />
      </View>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor="#FFF"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  },

  label: {
    marginLeft: 48,
    fontWeight: 'bold',
    fontSize: 16.5,
  },

  vacinaContainer: {
    marginHorizontal: 20,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },

  vacinaPendenteContainer: {
    marginHorizontal: 20,
    backgroundColor: '#ffe5e3',
    borderWidth: 1,
    borderColor: '#ff2b1c',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },

  vacinaTomadaContainer: {
    marginHorizontal: 20,
    backgroundColor: '#45af90EE',
    borderWidth: 1,
    borderColor: '#89ed87',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },

  nomeDependenteVacinaTomada: {
    color: '#fafafa',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },

  nomeVacinaTomada: {
    color: '#fafafa',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },

  dosesTomadas: {
    color: '#fafafa',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8
  },

  descricaoVacinaTomada: {
    color: '#fafafa',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8
  },

  dataVacinaTomada: {
    color: '#afa',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center'
  },

  dataVacinaPendente: {
    marginTop: 8,
    color: '#ff2b1c',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center'
  },

  dividerVacinaTomada: {
    height: 1,
    backgroundColor: '#89ed87',
    marginVertical: 8
  },

  dividerVacinaPendente: {
    height: 1,
    backgroundColor: '#ff2b1c',
    marginVertical: 8
  },

  divider: {
    height: 1,
    backgroundColor: '#D3D3D3',
    marginVertical: 8
  },

  nomeDependente: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },

  nomeVacina: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },

  doses: {
    fontSize: 14,
    marginBottom: 8
  },

  descricaoVacina: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 8
  },

  dataVacina: {
    fontSize: 14,
  },

  button: {
    marginTop: 14,
    padding: 8,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#2352FF',
  },

  textButton: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold'
  },

  buttonPendente: {
    marginTop: 14,
    padding: 8,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ff2b1c',
  },

  textPendenteButton: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold'
  }
});
