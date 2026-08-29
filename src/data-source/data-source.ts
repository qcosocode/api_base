/* Crear data source  

Cómo esta compuesto el archivo 

*/
import "reflect-metadata";
import {DataSource} from "typeorm"


import { EquipoEntity } from "../entities/equipo.entity"
import { Medicion } from "../entities/medicion"
import { SensorEntity } from "../entities/sensor.entity"
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
    entities: [SensorEntity, Medicion, EquipoEntity, PuntoMonitoreo , Institucion],
    synchronize: true,  // Activa creación automática de tablas (ideal para desarrollo)
    logging: false,
    

    
})
