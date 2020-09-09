import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, AsyncStorage } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Input, Button, ButtonGroup } from "react-native-elements";
import { mask, unMask } from "remask";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from 'moment';

import api from '../../../services/api';

export default function EditInfo({ navigation }) {
  const [user, setUser] = useState({});
  
  useEffect(() => {
    async function getUserData() {
      const userId = await AsyncStorage.getItem('usuario');
      const userData = await api.get(`/usuario/${userId}`);

      setUser(userData.data);
    }

    getUserData();
  }, []);
  
  function handleCPF(initialCPF) {
    let stringCPF = String(initialCPF);
    
    let CPF = mask(stringCPF, ["999.999.999-99"])
    
    return CPF;
  }
  
  function handleDataNasc(dataNasc) {
    const data = moment.utc(dataNasc).format('DD/MM/YYYY');
    
    return data;
  }
  
  const cpfState = handleCPF(user.cpf);
  const nomeState = user.nome;
  const sexoState = user.sexo;
  const indexState = user.sexo === 'Masculino' ? 0 : 1; 
  const data_nascState = handleDataNasc(user.data_nasc);
  
  const [cpf, setCPF] = useState(cpfState);
  const [nome, setNome] = useState(nomeState);
  const [selectedIndex, useSelectedIndex] = useState(indexState);
  const [sexo, setSexo] = useState(sexoState)
  const [data_nasc, setData] = useState(data_nascState);
  
  const sexos = ["Masculino", "Feminino"];

  useEffect(() => {
    setCPF(cpfState);
    setNome(nomeState);
    setSexo(sexoState);
    useSelectedIndex(indexState);
    setData(data_nascState);
  }, [cpfState, nomeState, sexoState, indexState, data_nascState])

  const onChangeData = (value) => {
      const originalValue = unMask(value);
      const maskedValue = mask(originalValue, ["99/99/9999"]);
      setData(maskedValue);
  };

  const formSchema = Yup.object().shape({
      nome: Yup.string().required("Campo obrigatório!"),
      data_nasc: Yup.string()
          .required("Campo obrigatório!")
          .min(10, "Insira uma data válida!"),
  });

  async function editInfo(values, errors) {
    const { nome, sexo } = values;
    let { data_nasc } = values;

    const today = moment();
    const minDate = moment("31/12/1919", "DD-MM-YYYY");

    data_nasc = moment(data_nasc, "DD/MM/YYYY");
    
    if (moment.max(today, data_nasc) === data_nasc || moment.min(minDate, data_nasc) === data_nasc) {
        errors.setFieldError("data_nasc", "Insira uma data válida!");
        return;
    }

    const dataFinal = moment(data_nasc, "DD/MM/YYYY").toDate();

    const userId = await AsyncStorage.getItem('usuario');
    
    await api.put(`/usuario/${userId}`, {
      nome,
      sexo,
      data_nasc: dataFinal
    });

    navigation.goBack();
  }

  return (
      <ScrollView style={styles.container}>
          <Formik
              enableReinitialize={true}
              validateOnChange={false}
              initialValues={{
                  email: user.email,
                  cpf,
                  nome,
                  sexo,
                  data_nasc
              }}
              onSubmit={(values, errors) => {
                editInfo(values, errors);
              }}
              validationSchema={formSchema}
          >
              {({
                  values,
                  handleSubmit,
                  errors,
              }) => (
                  <View style={styles.form}>
                    <Input
                          label="E-mail"
                          leftIcon={() => (
                              <Icon
                                  name="mail"
                                  color="#AAA"
                                  size={20}
                                  style={{ marginRight: 4 }}
                              />
                          )}
                          value={values.email}
                          labelStyle={styles.inputLabel}
                          inputStyle={styles.input}
                          placeholder="Seu e-mail"
                          placeholderTextColor="#999"
                          editable={false}
                          disabled={true}
                          />

                      <Input
                          label="CPF"
                          leftIcon={() => (
                            <Icon
                            name="assignment"
                            color="#AAA"
                            size={20}
                            style={{ marginRight: 4 }}
                            />
                            )}
                            value={cpf}
                            labelStyle={styles.inputLabel}
                            inputStyle={styles.input}
                            placeholder="Seu CPF"
                            placeholderTextColor="#999"
                            maxLength={14}
                            editable={false}
                            disabled={true}
                            />

                      <Input
                          label="Nome"
                          leftIcon={() => (
                              <Icon
                              name="portrait"
                              color="#AAA"
                              size={20}
                              style={{ marginRight: 4 }}
                              />
                              )}
                              value={nome}
                              onChangeText={setNome}
                              labelStyle={styles.inputLabel}
                              inputStyle={styles.input}
                              placeholder="Seu nome completo"
                              placeholderTextColor="#999"
                              keyboardType="default"
                              autoCapitalize="none"
                              autoCorrect={false}
                              errorMessage={errors.nome}
                              errorStyle={styles.error}
                              />

                      <View style={styles.sexos}>
                          <Text style={styles.labelSexos}>Sexo</Text>
                          <ButtonGroup
                              onPress={(selectedIndex) => {
                                  useSelectedIndex(selectedIndex);
                                  setSexo(sexos[selectedIndex]);
                              }}
                              selectedIndex={selectedIndex}
                              buttons={sexos}
                              textStyle={{ fontSize: 16 }}
                              selectedButtonStyle={{
                                  backgroundColor: "#2352FF",
                              }}
                              containerStyle={{}}
                          />
                      </View>

                      <Input
                          label="Data de nascimento"
                          leftIcon={() => (
                              <Icon
                                  name="today"
                                  color="#AAA"
                                  size={20}
                                  style={{ marginRight: 4 }}
                              />
                          )}
                          value={data_nasc}
                          onChangeText={(value) => {
                              onChangeData(value);
                              values.data_nasc = value;
                          }}
                          labelStyle={styles.inputLabel}
                          inputStyle={styles.input}
                          placeholder="dd/mm/aaaa"
                          placeholderTextColor="#999"
                          keyboardType="numeric"
                          autoCapitalize="none"
                          autoCorrect={false}
                          maxLength={14}
                          errorMessage={errors.data_nasc}
                          errorStyle={styles.error}
                      />

                      <Button
                          title="Editar informações"
                          type="solid"
                          raised={true}
                          onPress={handleSubmit}
                          buttonStyle={styles.button}
                          titleStyle={styles.buttonTitle}
                          containerStyle={styles.buttonContainer}
                      />
                  </View>
              )}
          </Formik>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#FFF",
  },

  form: {
      alignSelf: "stretch",
      marginTop: 30,
      paddingHorizontal: 28,
      backgroundColor: "#FFF",
  },

  inputLabel: {
      fontSize: 18,
      color: "#555",
      marginBottom: 5,
  },

  input: {
      color: "#444",
  },

  button: {
      backgroundColor: "#2352FF",
  },

  buttonTitle: {
      fontSize: 18,
  },

  buttonContainer: {
      marginHorizontal: 10,
      marginBottom: 24
  },

  registerButtonText: {
      fontSize: 16,
      color: "#45a16b",
  },

  error: {
      fontSize: 13,
      fontStyle: "italic",
  },

  sexos: {
      paddingHorizontal: 10,
      marginBottom: 20,
  },

  labelSexos: {
      fontSize: 18,
      color: "#555",
      marginBottom: 5,
      fontWeight: "bold",
  }
});