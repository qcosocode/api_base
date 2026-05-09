import { Request, Response } from "express";
import { EquipoService } from "../services/equipo.service";
import { CreateEquipoDTO } from "../interfaces/equipo.interface";

export class EquipoController {

  constructor(private readonly equipoService: EquipoService) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
      const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "50"), 10) || 50, 1),200);

      const filters = {
        equipoId: req.query.equipoID ? String(req.query.equipoID) : undefined,
        nombre: req.query.nombre ? String(req.query.nombre) : undefined,
        modelo: req.query.modelo ? String(req.query.modelo) : undefined,
        puntoMonitoreoId: req.query.punto_monitoreo_id
          ? String(req.query.punto_monitoreo_id)
          : undefined,
        _isActive: req.query.is_active === undefined
          ? undefined
          : String(req.query.is_active).toLowerCase() === "true",
        get isActive() {
          return this._isActive;
        },
        set isActive(value) {
          this._isActive = value;
        },
      };

      const result = await this.equipoService.getAll({ page, limit, filters });
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ message: err?.message ?? "Internal error" });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const equipoId = String(req.params.equipoId);
      const equipo = await this.equipoService.getById(equipoId);
      return res.json(equipo);
    } catch (err: any) {
      const msg = err?.message ?? "Error";
      if (msg === "EQUIPO_NOT_FOUND") return res.status(404).json({ message: msg });
      return res.status(500).json({ message: msg });
    }
  };

  create = async (req: Request<{}, {}, CreateEquipoDTO>, res: Response) => {
    try{

      const input : CreateEquipoDTO = {
        //equipoId: req.body.equipoId,
        nombre: req.body.nombre,
        modelo: req.body.modelo,
        descripcion: req.body.descripcion,
        isActive: req.body.isActive,
        puntoMonitoreoId: req.body.puntoMonitoreoId
      }
      //validaciones 
      // if(!input.equipoId){       // no deberia ser requerida 
      //   return res.status(400).json({ message: "EQUIPO_ID_REQUIRED"});
      // }
      if(!input.nombre){
        return res.status(400).json({ message: "NOMBRE_REQUIRED"});
      }
       
      const created = await this.equipoService.create(input);

      return res.status(201).json({
        succes: true,
        message: "Equipo creado correctamente",
        data: created,
      })

    } catch (err: any) {
      const msg = err?.message ?? "Error";    // Si err?.message es null/undefined => retorna "Error" 
      if (msg === "EQUIPO_ALREADY_EXISTS") {
      return res.status(409).json({ message: msg });
      }
      if (msg.endsWith("_REQUIRED")) {
      return res.status(400).json({ message: msg });
      }
       return res.status(500).json({ message: msg });
    }
  }

  assignPunto = async (req: Request, res: Response) => {
    try {
      const equipoId = String(req.params.equipoId);

      // Permite string UUID o null
      const puntoMonitoreoId =
        req.body?.puntoMonitoreoId === null || req.body?.puntoMonitoreoId === undefined
          ? null
          : String(req.body.puntoMonitoreoId);

      const updated = await this.equipoService.assignPuntoMonitoreo(
        equipoId,
        puntoMonitoreoId
      );

      return res.json(updated);
    } catch (err: any) {
      const msg = err?.message ?? "Error";
      if (msg === "EQUIPO_NOT_FOUND") return res.status(404).json({ message: msg });
      return res.status(500).json({ message: msg });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const equipoId = String(req.params.equipoId);
      const updated = await this.equipoService.update(equipoId, req.body);
      return res.json(updated);
    } catch (err: any) {
      const msg = err?.message ?? "Error";
      if (msg === "EQUIPO_NOT_FOUND") return res.status(404).json({ message: msg });
      if (msg === "equipoID_CANNOT_CHANGE") return res.status(400).json({ message: msg });
      return res.status(500).json({ message: msg });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const equipoId = String(req.params.equipoId);
      await this.equipoService.delete(equipoId);
      return res.status(204).send();
    } catch (err: any) {
      const msg = err?.message ?? "Error";
      if (msg === "EQUIPO_NOT_FOUND") return res.status(404).json({ message: msg });
      return res.status(500).json({ message: msg });
    }
  };
}
