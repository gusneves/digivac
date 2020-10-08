import React, {Component} from 'react';
import {ScrollView, Text, StyleSheet, Image} from 'react-native';

import logo from "../../assets/logo.png";
import cti from "../../assets/cti.png";

export default function Sobre() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <Image style={styles.cti} source={cti}/>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 25,
    paddingTop: 40
  },

  logo: {
    resizeMode: "contain",
    marginBottom: 40
  },
  cti:{
      resizeMode: "center",
      marginTop: 15,
      maxHeight: 40
  },
  titulo: {
    fontStyle: "italic",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginVertical:10,
    fontSize: 18,
  },
  texto: {
    fontSize: 16,
    textAlign: "justify",
    marginBottom: 10
  }
});
