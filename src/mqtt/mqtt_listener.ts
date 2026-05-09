// src/index.ts

import "reflect-metadata";
import { AppDataSource } from "../data-source/data-source";
import { MqttService } from "../services/mqtt.services";
import * as dotenv from 'dotenv';


export async function bootstrap( mqttUrl:string ) {
  try {
    console.log("Inicializando DataSource...");

    // Inicializa solo si no estaba inicializada
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Data Source inicializado correctamente!");
    }

    

    console.log("Repositorios generados.");

    dotenv.config();

    // Inicializar servicio MQTT
   //const mqttUrl = process.env.MQTT_URL;
  // const mqttUrl ="mqtt://161.35.100.210:1884"

  if (!mqttUrl) {
  throw new Error("MQTT_URL is not defined in environment variables");
  }  
    console.log(mqttUrl)
    const mqttService = new MqttService(mqttUrl);
    await mqttService.init();

    console.log("MQTT Listener iniciado y escuchando en /mediciones");

    console.log("Hola desde API v.1\n");

  } catch (err) {
    console.error("Error al arrancar la aplicación:", err);
  }
}

// Ejecutar la app
//bootstrap();

