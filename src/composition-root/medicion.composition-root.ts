// composition-root.ts
import { MedicionRepository } from "../repository/medicion.repository"
import { MedicionService } from "../services/medicion.service"
import { MedicionController } from "../controllers/medicion.controller"

export function createMedicionModule() {
  const medicionRepository = new MedicionRepository()
  const medicionService = new MedicionService(medicionRepository)
  const medicionController = new MedicionController(medicionService)

  return {
    medicionController,
  }
}
