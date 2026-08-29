import { SensorRepository } from "../repositories/sensor.repository";
import { SensorService} from "../services/sensor.service"
import {SensorController} from "../controllers/sensor.controller"
import { EquipoRepository } from "../repositories/equipo.repository";


export function createSensorModule(){
      const sensorRepository = new SensorRepository();  // no recibe entidad ?
      const equipoRepository = new EquipoRepository();
      const sensorService    = new SensorService(sensorRepository, equipoRepository);
      const sensorController = new SensorController(sensorService);

      return {sensorController,}
}

