import { NextFunction, Request, Response } from "express";
import { CreateEquipoDTO } from "../dto/equipo/create-equipo.dto";
import { EquipoQueryDTO } from "../dto/equipo/equipo-query.dto";
import { UpdateEquipoDTO } from "../dto/equipo/update-equipo.dto";
import { EquipoService } from "../services/equipo.service";
import { EquipoValidator } from "../validators/equipo.validator";

interface EquipoIdParams { equipoId: string; }
interface AssignPuntoBody { puntoMonitoreoId?: string | null; }

export class EquipoController {
  constructor(private readonly equipoService: EquipoService) {}

  getAll = async (req: Request<{}, {}, {}, EquipoQueryDTO>, res: Response, next: NextFunction) => {
    try { res.json(await this.equipoService.getAll(EquipoValidator.validateQuery(req.query))); } catch (error) { next(error); }
  };
  getById = async (req: Request<EquipoIdParams>, res: Response, next: NextFunction) => {
    try { res.json(await this.equipoService.getById(req.params.equipoId)); } catch (error) { next(error); }
  };
  create = async (req: Request<{}, {}, CreateEquipoDTO>, res: Response, next: NextFunction) => {
    try {
      const created = await this.equipoService.create(EquipoValidator.validateCreate(req.body));
      res.status(201).json({ succes: true, message: "Equipo creado correctamente", data: created });
    } catch (error) { next(error); }
  };
  update = async (req: Request<EquipoIdParams, {}, UpdateEquipoDTO>, res: Response, next: NextFunction) => {
    try { res.json(await this.equipoService.update(req.params.equipoId, EquipoValidator.validateUpdate(req.body))); } catch (error) { next(error); }
  };
  assignPunto = async (req: Request<EquipoIdParams, {}, AssignPuntoBody>, res: Response, next: NextFunction) => {
    try {
      const puntoId = req.body?.puntoMonitoreoId == null ? null : String(req.body.puntoMonitoreoId);
      res.json(await this.equipoService.assignPuntoMonitoreo(req.params.equipoId, puntoId));
    } catch (error) { next(error); }
  };
  delete = async (req: Request<EquipoIdParams>, res: Response, next: NextFunction) => {
    try { await this.equipoService.delete(req.params.equipoId); res.status(204).send(); } catch (error) { next(error); }
  };
}
