import React, { useState, useEffect } from "react";
import { Alert, Button, Text, View, StyleSheet, StatusBar } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  const [localizacao, setLocalizacao] = useState(null);
  const [data, setData] = useState(new Date());

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão para acessar a localização foi negada");
        return;
      }

      let localizacao = await Location.getCurrentPositionAsync({});
      setLocalizacao(localizacao);
    })();
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
