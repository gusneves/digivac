import React, {Component, useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, AsyncStorage} from 'react-native';
import api from '../../services/api';
import Box from '../../components/Box'
import loadUser from '../../methods/loadUser';
import { TouchableOpacity } from 'react-native-gesture-handler';
//import Carousel from '../components/Carousel.js';

export default function Home({ navigation }) {
  const [user, setUser] = useState({});
  const [vacina, setVacinas] = useState([]);

  //SETA STATES

  useEffect(() => {
    async function getData() {
      const userId = await AsyncStorage.getItem('usuario');
      const userData = await api.get(`/usuario/${userId}`);

      const vacinasData = await api.get('vacina');

      setUser(userData.data);
      setVacinas(vacinasData.data);
    }

    getData();

  }, []);

  const nomeState = user.nome;
  const dependenteState = user.dependentes;
  const vacinaUserState = user.vacinas;
  const vacinaState = vacina;
  
  const [nome, setNome] = useState(nomeState);
  const [dependentes, setDependentes] = useState(dependenteState);
  const [vacinas, setVacina] = useState(vacinaState);
  const [vacinaUser, setVacinaUser] = useState(vacinaUserState);
  

  useEffect(() => {
    setNome(nomeState);
    setDependentes(dependenteState);
    setVacina(vacinaState);
    setVacinaUser(vacinaUserState)
  }, [nomeState, dependenteState, vacinaState])

  if(vacinaUser) console.log(vacinaUser)
  
  //console.log(dependentes)

  //ORGANIZA LISTA DE VACINAS
  //NOME, DATA, ID PESSOA, NOME VACINA, ID VACINA
  //VACINAUSER ---> [ARRAY DE VACINAS DO USER]
  //VACINADEPENDENTES ---> [ARRAY DE VACINAS DOS DEPENDENTES]

  /*
  function createArray() {
    let array = [];
    vacinaUser.forEach(element,index => {
      array.concat({
        idVacina: vacinaUser[index].id,
        nome: vacinaUser[index].nome,
        data: vacinaUser[index].dataDose
      });
    });
  }
  */
  const text = "Rotavirus (em latim: rota, roda, pela sua forma) é um género de vírus de RNA bicatenário"
                  + "da família Reoviridae. É umas das principais causas de diarreia grave em lactentes e crianças jovens, e é um dos diversos vírus que causam "
                  + "infeções comummente chamadas de gastroenterites. Estima-se que, aos cinco anos de idade, quase todas as "
                  + "crianças do mundo tenham sido infectadas por um rotavírus ao menos uma vez. No entanto, como em cada infecção a imunidade se desenvolve, "
                  + "as infecções subsequentes são menos graves e adultos raramente são afectados. Existem oito espécies deste tipo de vírus, "
                  + "conhecidas como A, B, C, D, E, F, G e H. O Rotavírus A, o mais comum, é o responsável por mais de 90% das infecções em seres humanos"
      
          
                  
    return (
        <View style={styles.container}>
        <Text style={styles.titleVac}>Vacinas a serem tomadas:</Text>
        
        <FlatList 
        horizontal={true}
        data={vacinaUser}
        keyExtractor={item=>item._id}
        renderItem={ ({ item }) => (

          <Box title={user.nome} text={item.id}
                padding={2} width={150} backColor="white"
                borderWidth={1} margin={10} borderMargin={5} borderRadius={5}
                borderColor='#555'  
                />
          ) }
          />

        <Text style={styles.titleVac}>Aprenda mais:</Text>

        <Box title="Rotavirus" text={text} rodape="Saiba mais..."
            padding={4} backColor="white"
            borderWidth={1} margin={10} borderMargin={5} borderRadius={5}
            borderColor='#555' width="100%" 
        />

        </View>
    );
}

const styles = StyleSheet.create({
  titleVac:{
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
    fontWeight: 'bold',
    marginTop: 10
  },
  container: {
    paddingHorizontal: 28
  }
})
