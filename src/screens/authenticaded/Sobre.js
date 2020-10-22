import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';

import logo from "../../assets/logo.png";
import cti from "../../assets/cti.png";
import unesp from "../../assets/unesp.png";

export default function Sobre() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <Image style={styles.logo} source={logo} />
      <Text style={styles.titulo}>Quem somos?</Text>
      <Text style={styles.texto}>
        A DigiVac é um projeto desenvolvido pelos alunos de informática do Colégio Técnico Industrial "Prof. Isaac Portal Roldán"
        como trabalho de conclusão de curso. Os dois principais objetivos de nosso projeto são garantir informações sobre as vacinas, assim como
        sobre as doenças que elas previnem,
        e também de fornecer uma gestão de dados da carteira nacional de vacinação de maneira totalmente digital, prevenindo contra a perda de informações
        caso ocorra extravio do documento físico.
      </Text>
      <Text style={styles.titulo}>Desenvolvedores</Text>
      <Text style={styles.texto}>
        Daniel Pires, Eduardo Figueiredo, Giovani Bello, Gustavo Neves,
        Laura Rocha, Maria Luiza Alves, Matheus Ranzani, Paula Dobkowski e Pedro Moço.
      </Text>
      <View style={styles.cti_unesp}>
        <Image style={styles.cti} source={cti} />
        <Image style={styles.unesp} source={unesp} />
      </View>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 10
  },

  logo: {
    resizeMode: "contain",
    marginBottom: 30
  },
  cti_unesp: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center'
  },
  cti: {
    resizeMode: 'contain',
    width: 100,
    height: 80,
    marginRight: 30
  },
  unesp: {
    resizeMode: 'contain',
    width: 140,
    height: 100,
  },
  titulo: {
    fontStyle: "italic",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginVertical: 10,
    fontSize: 18,
  },
  texto: {
    fontSize: 16,
    textAlign: "justify",
    marginBottom: 10
  }
});
