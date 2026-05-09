/* Crear data source  

Cómo esta compuesto el archivo 

*/
import "reflect-metadata";
import {DataSource} from "typeorm"


import { Equipo } from "../entities/equipo"
import { Medicion } from "../entities/medicion"
import { Sensor } from "../entities/sensor"
import { PuntoMonitoreo } from "../entities/punto-monitoreo";
import { Institucion } from "../entities/institucion";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    // port: process.env.DB_PORT,
    port:5433,
    username: "postgres",
    password: "postgres",
    database: "monitoreo_base",

    // Indispensable para habilitar TimescaleDB
    entities: [Sensor, Medicion, Equipo, PuntoMonitoreo , Institucion],
    synchronize: true,  // Activa creación automática de tablas (ideal para desarrollo)
    logging: false,
    

    
})