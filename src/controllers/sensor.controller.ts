import { NextFunction, Request, Response } from "express";
import { CreateSensorDTO } from "../dto/sensor/create-sensor.dto";
import { SensorQueryDTO } from "../dto/sensor/sensor-query.dto";
import { UpdateSensorDTO } from "../dto/sensor/update-sensor.dto";
import { SensorService } from "../services/sensor.service";
import { SensorValidator } from "../validators/sensor.validator";

interface SensorRouteParams { equipoId?: string; sensorId?: string; }

export class SensorController {
  constructor(private readonly sensorService: SensorService) {}
  getAll = async (req: Request<SensorRouteParams, {}, {}, SensorQueryDTO>, res: Response, next: NextFunction) => {
    try {
      const query = SensorValidator.validateQuery(req.query, req.params.equipoId);
      res.status(200).json(await this.sensorService.getAll(query, req.params.equipoId));
    } catch (error) { next(error); }
  };
  createSensor = async (req: Request<SensorRouteParams, {}, CreateSensorDTO>, res: Response, next: NextFunction) => {
    try { res.status(201).json(await this.sensorService.createSensor(SensorValidator.validateCreate(req.body, req.params.equipoId))); } catch (error) { next(error); }
  };
  getSensorById = async (req: Request<SensorRouteParams>, res: Response, next: NextFunction) => {
    try { res.status(200).json(await this.sensorService.getSensorById(String(req.params.sensorId), req.params.equipoId)); } catch (error) { next(error); }
  };
  updateSensor = async (req: Request<SensorRouteParams, {}, UpdateSensorDTO>, res: Response, next: NextFunction) => {
    try { res.status(200).json(await this.sensorService.updateSensor(String(req.params.sensorId), SensorValidator.validateUpdate(req.body), req.params.equipoId)); } catch (error) { next(error); }
  };
  deleteSensor = async (req: Request<SensorRouteParams>, res: Response, next: NextFunction) => {
    try { await this.sensorService.deleteSensor(String(req.params.sensorId), req.params.equipoId); res.status(204).send(); } catch (error) { next(error); }
  };
}
