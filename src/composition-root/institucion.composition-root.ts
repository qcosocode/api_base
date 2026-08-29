// src/composition-root/institucion.composition-root.ts

import { InstitucionRepository } from "../repositories/institucion.repository";
import { InstitucionService } from "../services/institucion.service";
import { InstitucionController } from "../controllers/institucion.controller";

export function createInstitucionModule() {
  const institucionRepository = new InstitucionRepository();
  const institucionService = new InstitucionService(institucionRepository);
  const institucionController = new InstitucionController(institucionService);

  return {
    institucionRepository,
    institucionService,
    institucionController,
  };
}