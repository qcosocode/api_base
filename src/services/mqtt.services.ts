// src/mqtt/mqtt.ts

import mqtt, { MqttClient, IClientOptions } from "mqtt";
import { MedicionEntity } from "../entities/medicion.entity";
import { IMedicionRepository } from "../interfaces/repositories/medicion.repository.interface";

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
  private readonly medicionRepo: IMedicionRepository;

  constructor(mqttAddress: string, medicionRepo: IMedicionRepository) {
    
    this.client = mqtt.connect(mqttAddress, options);
    this.medicionRepo = medicionRepo;
  }

  /**
   * Inicializa la DB (si aún no está inicializada) y configura eventos MQTT.
   * Llamar una sola vez desde tu entrypoint (index.ts / server.ts).
   */
  async init() {
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
    const medicionesToInsert = payload.Sensores.map((sensorPayload) => {
      const medicion = new MedicionEntity();
      medicion.sensor_id = sensorPayload.sensorId;
      medicion.valor = sensorPayload.valor;
      medicion.time = currentTime;
      // relación ManyToOne -> sensor. TypeORM permite setear solo la PK
      return medicion;
    });

    // Inserción masiva (asumiendo que createMany usa repo.insert o similar)
    await this.medicionRepo.createMany(medicionesToInsert);

    console.log(
      `Insertadas ${medicionesToInsert.length} mediciones del equipo ${payload.equipoId}`
    );
  }
}
