// src/controllers/institucion.controller.ts

import { Request, Response } from "express";
import { InstitucionService } from "../services/institucion.service";
import {
  CreateInstitucionDTO,
  InstitucionQueryDTO,
  UpdateInstitucionDTO,
} from "../interfaces/institucion.interface";

export class InstitucionController {
  constructor(private readonly institucionService: InstitucionService) {}

  getAll = async (
    req: Request<{}, {}, {}, InstitucionQueryDTO>,
    res: Response
  ) => {
    try {
      const query: InstitucionQueryDTO = {
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
      };

      const result = await this.institucionService.getAll(query);

      return res.status(200).json({
        message: "Instituciones obtenidas correctamente",
        ...result,
      });
    } catch (err: any) {
      const msg = err?.message ?? "ERROR";
      return res.status(500).json({ message: msg });
    }
  };

  getById = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const institucion = await this.institucionService.getById(id);

      return res.status(200).json({
        message: "Institución obtenida correctamente",
        data: institucion,
      });
    } catch (err: any) {
      const msg = err?.message ?? "ERROR";

      if (msg === "INSTITUCION_ID_REQUIRED") {
        return res.status(400).json({ message: msg });
      }

      if (msg === "INSTITUCION_NOT_FOUND") {
        return res.status(404).json({ message: msg });
      }

      return res.status(500).json({ message: msg });
    }
  };

  create = async (
    req: Request<{}, {}, CreateInstitucionDTO>,
    res: Response
  ) => {
    try {
      const input: CreateInstitucionDTO = {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
      };

      const created = await this.institucionService.create(input);

      return res.status(201).json({
        message: "Institución creada correctamente",
        data: created,
      });
    } catch (err: any) {
      const msg = err?.message ?? "ERROR";

      if (msg === "NOMBRE_REQUIRED") {
        return res.status(400).json({ message: msg });
      }

      return res.status(500).json({ message: msg });
    }
  };

  update = async (
    req: Request<{ id: string }, {}, UpdateInstitucionDTO>,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const input: UpdateInstitucionDTO = {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
      };

      const updated = await this.institucionService.update(id, input);

      return res.status(200).json({
        message: "Institución actualizada correctamente",
        data: updated,
      });
    } catch (err: any) {
      const msg = err?.message ?? "ERROR";

      if (msg === "INSTITUCION_ID_REQUIRED" || msg === "NOMBRE_EMPTY") {
        return res.status(400).json({ message: msg });
      }

      if (msg === "INSTITUCION_NOT_FOUND") {
        return res.status(404).json({ message: msg });
      }

      return res.status(500).json({ message: msg });
    }
  };

  delete = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      await this.institucionService.delete(id);

      return res.status(200).json({
        message: "Institución eliminada correctamente",
      });
    } catch (err: any) {
      const msg = err?.message ?? "ERROR";

      if (msg === "INSTITUCION_ID_REQUIRED") {
        return res.status(400).json({ message: msg });
      }

      if (msg === "INSTITUCION_NOT_FOUND") {
        return res.status(404).json({ message: msg });
      }

      return res.status(500).json({ message: msg });
    }
  };
}