// src/mqtt/mqtt.ts

import mqtt, { MqttClient, IClientOptions } from "mqtt";
import { AppDataSource } from "../data-source/data-source";
import { MedicionRepository } from "../repository/medicion.repository";
// import { SensorRepository } from "../repository/sensor.repository"; // 
// import { Sensor } from "../entities/sensor";

const options: IClientOptions = {
  username: "MonitoreoIOT",
  password: "Monitor",
  clean: true,
  port: 1884,
};

interface IncomingMedicionPayload {
  equipoId: string;
  Sensores: Array<{
    sensorId: string;
    codigoPCB: string;
    valor: number;
  }>;
}

export class MqttService {
  private client: MqttClient;
  private medicionRepo: MedicionRepository;

  constructor(  mqttAddress : string ) {
    
    this.client = mqtt.connect(mqttAddress, options);
    this.medicionRepo = new MedicionRepository();
  }

  /**
   * Inicializa la DB (si aún no está inicializada) y configura eventos MQTT.
   * Llamar una sola vez desde tu entrypoint (index.ts / server.ts).
   */
  async init() {
    console.log("Inicializando DataSource (si es necesario)...");

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Base de datos conectada.");
    } else {
      console.log("DataSource ya estaba inicializado.");
    }

    this.setupEvents();
  }

  private setupEvents() {
    this.client.on("connect", () => {
      console.log("MQTT conectado.");

      this.client.subscribe("/mediciones", (err) => {
        if (err) {
          console.error("Error al suscribirse a /mediciones:", err.message);
        } else {
          console.log("Suscripto al tópico /mediciones");
        }
      });
    });

    this.client.on("message", async (topic, message) => {
      if (topic === "/mediciones") {  
        try {
          await this.handleMedicionesMessage(message.toString());
        } catch (error) {
          console.error("Error procesando mensaje MQTT:", error);
        }
      }
    });

    this.client.on("error", (err) => {
      console.error("Error en cliente MQTT:", err.message);
    });
  }
  
  private async handleMedicionesMessage(payloadStr: string) {
    console.log("Mensaje recibido en /mediciones:", payloadStr);

    let payload: IncomingMedicionPayload;

    try {
      payload = JSON.parse(payloadStr);
    } catch (e) {
      console.error("Error parseando JSON de /mediciones:", e);
      return;
    }

    const currentTime = new Date();

    // Mapeamos cada sensor del payload a un objeto de inserción
    const medicionesToInsert = payload.Sensores.map((s) => ({
      valor: s.valor,
      time: currentTime,
      // relación ManyToOne -> sensor. TypeORM permite setear solo la PK
      sensor: { sensorId: s.sensorId } as any,
    }));

    // Inserción masiva (asumiendo que createMany usa repo.insert o similar)
    await this.medicionRepo.createMany(medicionesToInsert);

    console.log(
      `Insertadas ${medicionesToInsert.length} mediciones del equipo ${payload.equipoId}`
    );
  }
}
