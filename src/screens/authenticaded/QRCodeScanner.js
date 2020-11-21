import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, Text, Button, AsyncStorage, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { CarteiraContext } from '../../context/Carteira';

import api from '../../services/api';

export default function QRCodeScanner({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [invalidQRCode, setInvalidQRCode] = useState(false);

  const { setCarteiraInfo } = useContext(CarteiraContext);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const atualizaCarteira = async (idPessoa) => {
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

    let carteiraFinal = {};

    dependentesUsuario.map(data => {
      if (data._id === idPessoa) {
        carteiraFinal = data;
      }
    });

    return carteiraFinal;
  }

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    
    const idUsuario = await AsyncStorage.getItem('usuario');
    const idPessoa = route.params._idPessoa;
    const idVacina = route.params._idVacina;
    let doseAtualizada = route.params.doseAtual;
    doseAtualizada++;

    if (data === 'digivac') {
      if (route.params._idPessoa === idUsuario) {
        await api.put(`/dose/${idVacina}`, {
          doseAtual: doseAtualizada
        }).then(() => {
            Alert.alert('Sucesso', 'Vacina tomada com sucesso! Arraste o dedo pra baixo em sua carteira para atualizá-la!');
            (async () => {
              let carteiraAtualizada = await atualizaCarteira(idUsuario);
              setCarteiraInfo(carteiraInfo => [...carteiraInfo, carteiraAtualizada]);
              navigation.navigate('Agenda');
            })();
          }
          );
        } else {
          await api.put(`/dose/${idUsuario}/${idPessoa}/${idVacina}`, {
            doseAtual: doseAtualizada
          }).then(() => {
            Alert.alert('Sucesso', 'Vacina tomada com sucesso! Arraste o dedo pra baixo em sua carteira para atualizá-la!');
            (async () => {
              let carteiraAtualizada = await atualizaCarteira(idPessoa);
              setCarteiraInfo(carteiraInfo => [...carteiraInfo, carteiraAtualizada]);
              navigation.navigate('Agenda');
            })();
        });
      }
    } else {
      setInvalidQRCode(true);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          Requisitando acesso à camera...
        </Text>
      </View>
    ); 
  }
  if (hasPermission === false) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          Sem permissão para acessar a câmera 😞
        </Text>
      </View>
    ); 
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ flex: 1, marginVertical: 50 }}
        />

      {invalidQRCode && 
        <Button 
          title={'QR Code inválido, aperte esse botão para escanear novamente'} 
          onPress={() =>{
              setInvalidQRCode(false);
              setScanned(false);
            }
          }  
        />}
      </View>
      <StatusBar
        barStyle={'light-content'}
        translucent={false}
        backgroundColor="#2352FF"
      />
    </>
  );
}