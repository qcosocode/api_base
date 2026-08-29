import { Router } from "express";
import { DataSource } from "typeorm";

import { PuntoMonitoreo } from "../entities/punto-monitoreo";
import { PuntoMonitoreoRepository } from "../repositories/punto-monitoreo.respository";
import { PuntoMonitoreoService } from "../services/punto-monitoreo.service";
import { PuntoMonitoreoController } from "../controllers/punto-monitoreo.controller";

export function createPuntoMonitoreoModule() {
  // TypeORM repo (solo acá, en el root)

  // Repository
  const repo = new PuntoMonitoreoRepository();

  // Service
  const puntoService = new PuntoMonitoreoService(repo);

  // Controller
  const puntoController = new PuntoMonitoreoController(puntoService);

  // Routes
  return {puntoController,};
}
