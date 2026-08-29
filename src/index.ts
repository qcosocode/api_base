
import { AppDataSource } from "./data-source/data-source";
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();



import medicionesRoutes from './routes/medicion.routes';
import equiposRoutes from './routes/equipo.routes';
import sensorRoutes from './routes/sensor.route';

// import { swaggerSpec } from "./config/swagger";
import puntoMonitoreoRoutes from "./routes/punto-monitoreo.routes";
import institucionRoutes from "./routes/institucion.routes";
import { bootstrap } from "./mqtt/mqtt_listener";
import { errorHandler } from "./middleware/error-handler.middleware";


 AppDataSource.initialize()
  .then(() => {
     console.log("Data Source inicializado correctamente!");
  })
  .catch((err) => {
     console.error("Error al inicializar Data Source:", err);
  });
  


/* MQTT  */
const mqttUrl = process.env.MQTT_URL;

if (!mqttUrl) {
  throw new Error("MQTT_URL no definida");
}

bootstrap(mqttUrl);

/* Express  */

const app = express(); 
app.use(express.json());

app.use('/mediciones', medicionesRoutes);
app.use('/equipos', equiposRoutes);
app.use('/sensores',sensorRoutes);
app.use('/puntos-monitoreo',puntoMonitoreoRoutes);
app.use('/institucion',institucionRoutes);
app.use(errorHandler);


app.listen( 3001, () => {console.log("Hola desde API v.1");});




 
