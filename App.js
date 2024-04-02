import React, { useState, useEffect } from "react";
import { Alert, Button, Text, View, StyleSheet, StatusBar } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  const [localizacao, setLocalizacao] = useState(null);
  const [data, setData] = useState(new Date());

  useEffect(() => {
    const solicitarPermissaoLocalizacao = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão para acessar a localização foi negada",
          "Para usar este recurso, ative a permissão de localização nas configurações do seu dispositivo.",
          [{ text: "OK" }]
        );
        return;
      }

      try {
        let localizacao = await Location.getCurrentPositionAsync({});
        setLocalizacao(localizacao);
      } catch (error) {
        console.error("Erro ao obter localização:", error);
        Alert.alert(
          "Erro ao obter localização",
          "Ocorreu um erro ao tentar obter a localização. Verifique as configurações do seu dispositivo e tente novamente.",
          [{ text: "OK" }]
        );
      }
    };

    solicitarPermissaoLocalizacao();
  }, []);

  const registrarPonto = () => {
    const agora = new Date();
    setData(agora);
    Alert.alert(
      "Ponto Registrado",
      `Ponto registrado em ${agora.toLocaleString("pt-BR")}`
    );
  };

  return (
    <View style={estilos.container}>
      <StatusBar />
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>Registro de Ponto</Text>
      </View>
      <View style={estilos.corpo}>
        {localizacao && (
          <MapView
            style={estilos.mapa}
            initialRegion={{
              latitude: localizacao.coords.latitude,
              longitude: localizacao.coords.longitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,
            }}
          >
            <Marker
              coordinate={{
                latitude: localizacao.coords.latitude,
                longitude: localizacao.coords.longitude,
              }}
              title="Minha Localização"
            />
          </MapView>
        )}
        <Text style={estilos.texto}>
          Data/Hora: {data ? data.toLocaleString("pt-BR") : "N/A"}
        </Text>
        <Button title="Registrar Ponto" onPress={registrarPonto} />
        <Button title="Ver pontos marcados" />
      </View>
    </View>
  );
}
const estilos = StyleSheet.create({
  texto: {
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  cabecalho: {
    height: 50,
    backgroundColor: "#6200EE",
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  corpo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapa: {
    width: "80%",
    height: "50%",
  },
});
