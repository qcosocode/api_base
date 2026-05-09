// src/controllers/puntoMonitoreo.controller.ts

import { Request, Response } from "express";
import { PuntoMonitoreoService, NotFoundError, ValidationError } from "../services/punto-monitoreo.service";
import { PuntoMonitoreoCreateDTO, PuntoMonitoreoUpdateDTO } from "../interfaces/punto-monitoreo.interface";



const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_V4_REGEX.test(value);
}



function handleError(res: Response, err: unknown) {
  if (err instanceof ValidationError) return res.status(400).json({ message: err.message });
  if (err instanceof NotFoundError) return res.status(404).json({ message: err.message });
  return res.status(500).json({ message: "Error interno" });
}

export class PuntoMonitoreoController {
  constructor(private readonly service: PuntoMonitoreoService) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getAll(req.query as any);
      res.json(result);
    } catch (err) {
      handleError(res, err);
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { puntoMonitoreoId } = req.params;
      if (!isUuid(puntoMonitoreoId)) return res.status(400).json({ message: "puntoMonitoreoId inválido" });

      const result = await this.service.getById(puntoMonitoreoId);
      res.json(result);
    } catch (err) {
      handleError(res, err);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const dto = req.body as PuntoMonitoreoCreateDTO;

      // validación simple (lo fino va en service)
      if (!dto || typeof dto !== "object") return res.status(400).json({ message: "Body inválido" });
      if (!dto.institucionId || !isUuid(dto.institucionId)) {
        return res.status(400).json({ message: "institucionId inválido" });
      }

      const result = await this.service.create(dto);
      res.status(201).json(result);
    } catch (err) {
      handleError(res, err);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { puntoMonitoreoId } = req.params;
      if (!isUuid(puntoMonitoreoId)) return res.status(400).json({ message: "puntoMonitoreoId inválido" });

      const dto = req.body as PuntoMonitoreoUpdateDTO;
      if (!dto || typeof dto !== "object") return res.status(400).json({ message: "Body inválido" });

      const result = await this.service.update(puntoMonitoreoId, dto);
      res.json(result);
    } catch (err) {
      handleError(res, err);
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const { puntoMonitoreoId } = req.params;
      if (!isUuid(puntoMonitoreoId)) return res.status(400).json({ message: "puntoMonitoreoId inválido" });

      await this.service.remove(puntoMonitoreoId);
      res.status(204).send();
    } catch (err) {
      handleError(res, err);
    }
  };
}
