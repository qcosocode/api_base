// composition-root.ts
import { MedicionRepository } from "../repositories/medicion.repository"
import { MedicionService } from "../services/medicion.service"
import { MedicionController } from "../controllers/medicion.controller"
import { SensorRepository } from "../repositories/sensor.repository"

export function createMedicionModule() {
  const medicionRepository = new MedicionRepository()
  const sensorRepository = new SensorRepository()
  const medicionService = new MedicionService(medicionRepository, sensorRepository)
  const medicionController = new MedicionController(medicionService)

  return {
    medicionController,
  }
}
