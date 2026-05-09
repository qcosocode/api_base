// src/routes/puntosMonitoreo.routes.ts

import { Router } from "express";
import { PuntoMonitoreoController } from "../controllers/punto-monitoreo.controller";
import { createPuntoMonitoreoModule } from "../composition-root/punto-monitoreo.composition-root";

  
  const router = Router();
  const {puntoController}  = createPuntoMonitoreoModule();

  // GET /puntos-monitoreo?page=&limit=&institucionId=&search=
  router.get("/", puntoController.getAll);

  // POST /puntos-monitoreo
  router.post("/", puntoController.create);

  // GET /puntos-monitoreo/:puntoMonitoreoId
  router.get("/:puntoMonitoreoId", puntoController.getById);

  // PATCH /puntos-monitoreo/:puntoMonitoreoId
  router.patch("/:puntoMonitoreoId", puntoController.update);

  // DELETE /puntos-monitoreo/:puntoMonitoreoId
  router.delete("/:puntoMonitoreoId", puntoController.remove);

  export default router;

