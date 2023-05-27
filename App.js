//RM-95125 Caio Felipe Britto Zanardo da Silva
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('alunos.db');

export default function App() {
  
  const CadastroAluno = () => {
    const [nome, setNome] = useState('');
    const [ra, setRA] = useState('');
    const [curso, setCurso] = useState('');
    const [alunos, setAlunos] = useState([]);

    useEffect(() => {
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS alunos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, ra TEXT, curso TEXT);'
        );
      }, null, console.log('Tabela criada ou verificada com sucesso'));

      carregarAlunos();
    }, []);

    const carregarAlunos = async () => {
      try {
        const value = await AsyncStorage.getItem('alunos');
        if (value !== null) {
          setAlunos(JSON.parse(value));
        }
      } catch (error) {
        console.error(error);
      }
    };

    const salvarAlunos = async (alunos) => {
      try {
        await AsyncStorage.setItem('alunos', JSON.stringify(alunos));
      } catch (error) {
        console.error(error);
      }
    };

    const handleSalvarAluno = () => {
      if (nome && ra && curso) {
        const novoAluno = {
          id: Date.now(),
          nome,
          ra,
          curso,
        };
        setAlunos([...alunos, novoAluno]);
        salvarAlunos([...alunos, novoAluno]);
        setNome('');
        setRA('');
        setCurso('');
      }
    };

    const handleExcluirAluno = (id) => {
      const novosAlunos = alunos.filter(aluno => aluno.id !== id);
      setAlunos(novosAlunos);
      salvarAlunos(novosAlunos);
    };

    const renderItem = ({ item }) => (
      <ItemAluno
        nome={item.nome}
        ra={item.ra}
        curso={item.curso}
        onPressExcluir={() => handleExcluirAluno(item.id)}
      />
    );

    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Registrar Aluno</Text>
        <TextInput
          style={styles.input}
          placeholder="Aluno"
          placeholderTextColor="white"
          onChangeText={setNome}
          value={nome}
        />
       <TextInput
          style={styles.input2}
          placeholder="RA"
          placeholderTextColor="white"
          onChangeText={setRA}
          value={ra}
        />
        <TextInput
          style={styles.input2}
          placeholder="Cursando"
          placeholderTextColor="white"
          onChangeText={setCurso}
          value={curso}
        />
        <Button title="Salvar" onPress={handleSalvarAluno} />
        <Text style={styles.titulo}>Registrados no Next</Text>
        <FlatList
          data={alunos}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  };

  const ItemAluno = ({ nome, ra, curso, onPressExcluir }) => (
    <View style={styles.item}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemText}>Nome: {nome}</Text>
        <Text style={styles.itemText}>RA: {ra}</Text>
        <Text style={styles.itemText}>Curso: {curso}</Text>
      </View>
      <Button title="Apagar" onPress={onPressExcluir} />
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: 'black',
    },
    titulo: {
      fontSize: 30,
      color: 'red',
      alignSelf: 'center',
      marginTop: 15
    },
    input: {
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 4,
      fontSize: 15,
      padding: 10,
      marginBottom: 16,
      marginTop: 20,
      color: 'white',
    },
      input2: {
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 4,
      fontSize: 15,
      padding: 10,
      marginBottom: 16,
      color: 'white',
    },
    item: {
      backgroundColor: 'black',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderColor: '#fff',
    },
    itemTextContainer: {
      flex: 1,
    },
    itemText: {
      fontSize: 18,
      color: 'white',
    },
  });

  return <CadastroAluno />
};