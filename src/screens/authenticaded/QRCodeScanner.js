import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, Button, AsyncStorage, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import api from '../../services/api';

export default function QRCodeScanner({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    
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
            setIsValid(true);
            Alert.alert('Sucesso', 'Vacina tomada com sucesso!');
            navigation.navigate('Agenda');
          }
          );
        } else {
          await api.put(`/dose/${idUsuario}/${idPessoa}/${idVacina}`, {
            doseAtual: doseAtualizada
          }).then(() => {
            setIsValid(true);
            Alert.alert('Sucesso', 'Vacina tomada com sucesso!');
            navigation.navigate('Agenda');
        });
      }
    }
  };

  if (hasPermission === null) {
    // return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    // return <Text>No access to camera</Text>;
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

      {scanned && !isValid && <Button title={'QR Code errado, aperte esse botão para escanear novamente'} onPress={() => setScanned(false)} />}
      </View>
      <StatusBar
        barStyle={'light-content'}
        translucent={false}
        backgroundColor="#2352FF"
      />
    </>
  );
}