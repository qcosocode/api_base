import { SensorRepository } from "../repository/sensor.repository";
import { SensorService} from "../services/sensor.service"
import {SensorController} from "../controllers/sensor.controller"


export function createSensorModule(){
      const sensorRepository = new SensorRepository();  // no recibe entidad ?
      const sensorService    = new SensorService(sensorRepository);
      const sensorController = new SensorController(sensorService);

      return {sensorController,}
}

