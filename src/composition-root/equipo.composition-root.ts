import { EquipoRepository } from "../repositories/equipo.repository";
import { EquipoService } from "../services/equipo.service";
import { EquipoController } from "../controllers/equipo.controller";

// TODO revisar inyeccion independencias => cada request deberia usar una instancia independiente del repository
//

export function createEquipoModule() {
  const equipoRepository = new EquipoRepository();
  const equipoService = new EquipoService(equipoRepository);
  const equipoController = new EquipoController(equipoService);

  return { equipoController };
}
