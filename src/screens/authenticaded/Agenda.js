import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, StyleSheet, StatusBar, FlatList, AsyncStorage, ActivityIndicator, RefreshControl, LogBox
} from 'react-native';
import { Divider } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import moment from 'moment';

import { CarteiraContext } from '../../context/Carteira';

import api from '../../services/api';

import ListaVacinas from '../../components/ListaVacinas';

const DrawerAgenda = createDrawerNavigator();

export default function Agenda() {
  const [info, setInfo] = useState([]);

  const isFocused = useIsFocused();
  
  useEffect(() => {
    getInfo();
  }, [isFocused]);

  async function getInfo() {
    const id = await AsyncStorage.getItem('usuario');
    const { data } = await api.get(`/usuario/${id}`);

    const idUsuario = data._id;
    const dataNascUsuario = data.data_nasc;
    const nomeUsuario = data.nome;
    const vacinasUsuario = data.vacinas;

    const objetoUsuario = {
      _id: idUsuario,
      data_nasc: dataNascUsuario,
      nome: nomeUsuario,
      vacinas: vacinasUsuario
    };

    const dependentesUsuario = data.dependentes;

    dependentesUsuario.unshift(objetoUsuario);

    setInfo(dependentesUsuario);
  }

  function getPrimeiroNome(nomeInteiro) {
    const primeiroNome = nomeInteiro.replace(/ .*/, ''); // RegEx que subistitui tudo depois do espaço por vazio

    return primeiroNome;
  }

  return (
    <DrawerAgenda.Navigator>
      <DrawerAgenda.Screen
        name="Todas as vacinas pendentes"
        component={ListaVacinasTodasAsPessoas}
      />
      {info.map((info, key) => {
        return (
          <DrawerAgenda.Screen
            key={key} name={'Carteira de ' + getPrimeiroNome(info.nome)}
            component={ListaVacinas}
            initialParams={{ info }}
          />
        );
      })}
    </DrawerAgenda.Navigator>
  );
}

function ListaVacinasTodasAsPessoas({ navigation }) {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
  ]);

  const [, setUsuario] = useState({});
  const [vacinas, setVacinas] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getUsuario();
  }, []);

  async function getUsuario() {
    const id = await AsyncStorage.getItem('usuario');
    const { data } = await api.get(`/usuario/${id}`);

    setUsuario(data);

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
      });

      const idVacinasDependentes = [];
      const nomeVacinasDependentes = [];
      const dosesTotaisDependetes = [];
      const descricaoVacinasDependentes = [];

      for (let i = 0; i < vacinasDependentes.length; i++) {
        idVacinasDependentes.push(getIdVacinas(vacinasDependentes[i]));
      }

      for (let i = 0; i < idVacinasDependentes.length; i++) {
        nomeVacinasDependentes.push(await getNomeVacinas(idVacinasDependentes[i]));
        descricaoVacinasDependentes.push(await getDescricaoVacinasDependentes(idVacinasDependentes[i]));
        dosesTotaisDependetes.push(await getDosesTotaisVacinas(idVacinasDependentes[i]));
      }

      setVacinas(
        await juntaInfo(
          nomeDependentes, nomeVacinasDependentes,
          descricaoVacinasDependentes,
          dosesAtuaisDependentesFinal, dosesTotaisDependetes, dataDoseVacinasDependentes
        )
      );

      setLoading(false);
    } else {
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

    async function getDescricaoVacinasDependentes(idVacinas) {
      const descricaoVacinasDependentes = [];

      for (let i = 0; i < idVacinas.length; i++) {
        let dataVacinas = await api.get(`/vacina/${idVacinas[i]}`);

        descricaoVacinasDependentes.push(dataVacinas.data.descricao);
      }

      return descricaoVacinasDependentes;
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
      const dataDoseUsuario = [];

      for (let i = 0; i < vacinasUsuario.length; i++) {
        dosesAtuaisVacinasUsuario.push(data.vacinas[i].doseAtual);
        dataDoseUsuario.push(data.vacinas[i].dataDose);
      }

      let idVacinasUsuario = [];

      idVacinasUsuario = getIdVacinas(vacinasUsuario);

      const nomeVacinasUsuario = [];
      const descricaoVacinasUsuario = [];
      const dosesTotaisVacinasUsuario = [];

      for (const id of idVacinasUsuario) {
        let dataVacinasUsuario = await api.get(`/vacina/${id}`);

        nomeVacinasUsuario.push(dataVacinasUsuario.data.nome);
        dosesTotaisVacinasUsuario.push(dataVacinasUsuario.data.doses);
        descricaoVacinasUsuario.push(dataVacinasUsuario.data.descricao);
      }

      const diferencas = [];

      for (let i = 0; i < dosesTotaisVacinasUsuario.length; i++) {
        if (dosesTotaisVacinasUsuario[i] - dosesAtuaisVacinasUsuario[i] === 0) {
          diferencas.push(0);
        } else {
          diferencas.push(dosesTotaisVacinasUsuario[i] - dosesAtuaisVacinasUsuario[i]);
        }
      }

      const arrayVacinasUsuario = [];

      let pendente = true;

      for (let j = 0; j < nomeVacinasUsuario.length; j++) {
        if (diferencas[j] !== 0) {
          if (moment(dataDoseUsuario[j]).isBefore()) {
            arrayVacinasUsuario.push(criaObjetoVacinasUsuario(
              nomeUsuario, nomeVacinasUsuario[j],
              descricaoVacinasUsuario[j],
              dosesAtuaisVacinasUsuario[j], dosesTotaisVacinasUsuario[j], dataDoseUsuario[j], pendente
            ));
          } else {
            arrayVacinasUsuario.push(criaObjetoVacinasUsuario(
              nomeUsuario, nomeVacinasUsuario[j],
              descricaoVacinasUsuario[j],
              dosesAtuaisVacinasUsuario[j], dosesTotaisVacinasUsuario[j], dataDoseUsuario[j], !pendente
            ));
          }
        }
      }

      return arrayVacinasUsuario;
    }

    function criaObjetoVacinasUsuario(
      nome, vacina,
      descricao,
      doseAtual, doseTotal, dataDose,
      pendente) {
      let objeto = {
        nome,
        vacina,
        descricao,
        doseAtual,
        doseTotal,
        dataDose,
        pendente
      };

      return objeto;
    }

    async function juntaInfo(
      arrayNomes, arrayNomeVacinas,
      arrayDescricao,
      arrayDosesFinais, arrayDosesTotais, arrayDatas) {
      const arrayUsuario = await getArrayFinalUsuario();

      let arrayVacinasFinal = [];
      const diferencaEntreDoses = getDosesFinais(arrayDosesTotais, arrayDosesFinais);

      for (let i = 0; i < arrayNomeVacinas.length; i++) {
        arrayVacinasFinal.push(
          getVacinasDeCadaDependente(
            arrayNomes[i], arrayNomeVacinas[i],
            arrayDescricao[i],
            arrayDosesFinais[i], arrayDosesTotais[i], arrayDatas[i],
            diferencaEntreDoses[i]
          )
        );
      }

      const arrayDependentesFinal = [].concat.apply([], arrayVacinasFinal); // reduz a um array

      function getVacinasDeCadaDependente(
        nomeDependente, arrayNomeVacinasDependente,
        arrayDescricao,
        arrayDosesFinais, arrayDosesTotais, arrayDatas,
        diferenca
      ) {
        const objetoVacinasDependente = [];

        let pendente = true;

        for (let j = 0; j < arrayNomeVacinasDependente.length; j++) {
          let vacinaTomada = false;

          if (diferenca[j] !== 0) {
            if (moment(arrayDatas[j]).isBefore()) {
              objetoVacinasDependente.push(
                criaObjetoVacinas(
                  nomeDependente, arrayNomeVacinasDependente[j],
                  arrayDescricao[j],
                  arrayDosesFinais[j], arrayDosesTotais[j], arrayDatas[j],
                  vacinaTomada, pendente
                )
              );
            } else {
              objetoVacinasDependente.push(
                criaObjetoVacinas(
                  nomeDependente, arrayNomeVacinasDependente[j],
                  arrayDescricao[j],
                  arrayDosesFinais[j], arrayDosesTotais[j], arrayDatas[j],
                  vacinaTomada, !pendente
                )
              );
            }
          }
        }

        return objetoVacinasDependente;
      }

      function criaObjetoVacinas(
        dependente, vacina,
        descricao,
        doseAtual, doseTotal, dataDose,
        vacinaTomada, pendente) {
        let objeto = {
          nome: dependente,
          vacina,
          descricao,
          doseAtual,
          doseTotal,
          dataDose,
          vacinaTomada,
          pendente
        };

        return objeto;
      }

      const arrayVacinasPendentesDependetes = [];

      for (let i = 0; i < arrayDependentesFinal.length; i++) {
        if (!arrayDependentesFinal[i].vacinaTomada) {
          arrayVacinasPendentesDependetes.push(arrayDependentesFinal[i]);
        }
      }

      Array.prototype.push.apply(arrayUsuario, arrayVacinasPendentesDependetes);

      return arrayUsuario;
    }
  }

  function getPrimeiroNome(nomeInteiro) {
    const primeiroNome = nomeInteiro.replace(/ .*/, ''); // RegEx que subistitui tudo depois do espaço por vazio

    return primeiroNome;
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await getUsuario();
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

  if (Object.keys(vacinas).length === 0) {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.header}>
            <Icon name='menu' size={25} onPress={() => { navigation.openDrawer() }} />
            <Text style={styles.label}>Atente-se às vacinas pendentes!</Text>
          </View>
          <View style={{
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#fff',
          }}>
            <Text style={{fontSize: 26, fontWeight: 'bold', marginHorizontal: 20}}>
              Parabéns, todas as vacinas foram tomadas!
            </Text>
            <View style={{marginTop: 5}}>
              <Text style={{fontSize: 16, fontStyle: 'italic', marginHorizontal: 20}}>
                Acesse sua carteira completa apertando o botão do canto superior esquerdo.
              </Text> 
            </View>
          </View>
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
        <Text style={styles.nomeDependente}>({getPrimeiroNome(item.nome)})</Text>
        <Divider style={styles.dividerVacinaPendente} />
        <Text style={styles.doses}>Dose: {item.doseAtual}/{item.doseTotal}</Text>
        <Text style={styles.descricaoVacina}>Descrição: {item.descricao} </Text>
        <Text style={styles.dataVacina}>Data: {moment(item.dataDose).format('DD/MM/YYYY')}</Text>
        <Text style={styles.dataVacinaPendente}>Atenção: essa vacina está atrasada!</Text>
      </View>
    ) : (
      <View style={styles.vacinaContainer}>
        <Text style={styles.nomeVacina}>{item.vacina}</Text>
        <Text style={styles.nomeDependente}>({getPrimeiroNome(item.nome)})</Text>
        <Divider style={styles.divider} />
        <Text style={styles.doses}>Dose: {item.doseAtual}/{item.doseTotal}</Text>
        <Text style={styles.descricaoVacina}>Descrição: {item.descricao} </Text>
        <Text style={styles.dataVacina}>Próxima dose até: {moment(item.dataDose).format('DD/MM/YYYY')}</Text>
      </View>
    )
  ) : (
      <View style={styles.vacinaTomadaContainer}>
        <Text style={styles.nomeVacinaTomada}>{item.vacina}</Text>
        <Text style={styles.nomeDependenteVacinaTomada}>({getPrimeiroNome(item.nome)})</Text>
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
          <Text style={styles.label}>Atente-se às vacinas pendentes!</Text>
        </View>
        <FlatList
          data={vacinas}
          keyExtractor={(item, index) => 'key' + item.nome + index}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />}
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
    marginLeft: 14,
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
    backgroundColor: '#31872f',
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
    color: '#89ed87',
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

  divider: {
    height: 1,
    backgroundColor: '#D3D3D3',
    marginVertical: 8
  },

  dividerVacinaPendente: {
    height: 1,
    backgroundColor: '#ff2b1c',
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
  }
});
