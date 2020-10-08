import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, AsyncStorage, ActivityIndicator } from 'react-native';
import { Divider } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';

import api from '../../services/api';

export default function Agenda() {
  const [, setUsuario] = useState({});
  const [vacinas, setVacinas] = useState({});
  const [isLoading, setLoading] = useState(true);

  const isFocused = useIsFocused();

  useEffect(() => {
    getUsuario();
  }, []);

  useEffect(() => {
    getUsuario();
  }, [isFocused]);

  async function getUsuario() {
    const id = await AsyncStorage.getItem('usuario');
    const { data } = await api.get(`/usuario/${id}`);
    
    setUsuario(data);

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

      // console.log(await juntaInfo(nomeDependentes, nomeVacinasDependentes, dosesAtuaisDependentesFinal, dosesTotaisDependetes));
      setVacinas(
        await juntaInfo(
          nomeDependentes, nomeVacinasDependentes, descricaoVacinasDependentes, dosesAtuaisDependentesFinal, dosesTotaisDependetes
        )
      );

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

      for (let i = 0; i < vacinasUsuario.length; i ++) {
        dosesAtuaisVacinasUsuario.push(data.vacinas[i].doseAtual);
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

      const arrayUsuarioFinal = [];

      for (let j = 0; j < nomeVacinasUsuario.length; j++) {
        if (diferencas[j] === 0) {
          continue;
        }

        arrayUsuarioFinal.push(criaObjetoVacinasUsuario(
          nomeUsuario, nomeVacinasUsuario[j], descricaoVacinasUsuario[j], dosesAtuaisVacinasUsuario[j], dosesTotaisVacinasUsuario[j], '15/10/2020'
        ));
      }
      
      return arrayUsuarioFinal;
    }

    function criaObjetoVacinasUsuario(nome, vacina, descricao, doseAtual, doseTotal, data) {
      let objeto = {
        nome,
        vacina,
        descricao,
        doseAtual,
        doseTotal,
        data
      };

      return objeto;
    }

    async function juntaInfo(arrayNomes, arrayNomeVacinas, arrayDescricao, arrayDosesFinais, arrayDosesTotais, arrayDatas = '15/10/2020') {              
      const arrayUsuarioFinal = await getArrayFinalUsuario();

      if (arrayNomes.length === 0) {
        return arrayUsuarioFinal;
      }

      let arrayVacinasFinal = [];
      const diferencaEntreDoses = getDosesFinais(arrayDosesTotais, arrayDosesFinais);

      for (let i = 0; i < arrayNomeVacinas.length; i++) {
        arrayVacinasFinal.push(
          getVacinasDeCadaDependente(
            arrayNomes[i], arrayNomeVacinas[i], arrayDescricao[i], arrayDosesFinais[i], arrayDosesTotais[i], diferencaEntreDoses[i], arrayDatas
          )
        );
      }

      const arrayDependentesFinal = [].concat.apply([], arrayVacinasFinal); // reduz a um array

      function getVacinasDeCadaDependente(
        nomeDependente, arrayNomeVacinasDependente, arrayDescricao, arrayDosesFinais, arrayDosesTotais, diferenca, arrayDatas
      ) {
        let objetoVacinasDependente = [];
        
        for (let j = 0; j < arrayNomeVacinasDependente.length; j++) {
          
          if (diferenca[j] === 0) {
            continue;
          }
          objetoVacinasDependente.push(
            criaObjetoVacinas(
              nomeDependente, arrayNomeVacinasDependente[j], arrayDescricao[j], arrayDosesFinais[j], arrayDosesTotais[j], arrayDatas
            )
          );
        }

        return objetoVacinasDependente;
      }

      function criaObjetoVacinas(dependente, vacina, descricao, doseAtual, doseTotal, data) {
        let objeto = {
          nome: dependente,
          vacina,
          descricao,
          doseAtual,
          doseTotal,
          data
        };

        return objeto;
      }

      Array.prototype.push.apply(arrayUsuarioFinal, arrayDependentesFinal); // une os dois arrays no primeiro
      
      const arrayFinal = arrayUsuarioFinal;
      
      return arrayFinal;
    }
  }

  function getPrimeiroNome(nomeInteiro) {
    const primeiroNome = nomeInteiro.replace(/ .*/,''); // RegEx que subistitui tudo depois do espaço por vazio

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

  const renderItem = ({ item }) => (
    <View style={styles.vacinaContainer}>
      <Text style={styles.nomeVacina}>{item.vacina}</Text>
      <Text style={styles.nomeDependente}>({getPrimeiroNome(item.nome)})</Text>
      <Divider style={styles.divider}/>
      <Text style={styles.doses}>Dose: {item.doseAtual}/{item.doseTotal}</Text>
      <Text style={styles.descricaoVacina}>Descrição: {item.descricao} </Text>
      <Text style={styles.dataVacina}>Data: {item.data}</Text>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>Atente-se a todas as suas vacinas!</Text>

        <FlatList 
          data={vacinas}
          keyExtractor={(item, index) => 'key' + index}
          showsHorizontalScrollIndicator={false} 
          renderItem={renderItem}
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

  label: {
    margin: 20,
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'center'
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
  }
});