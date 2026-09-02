import { NextFunction, Request, Response } from "express";
import { MedicionQueryDTO } from "../dto/medicion/medicion-query.dto";
import { MedicionRangeQueryDTO } from "../dto/medicion/medicion-range-query.dto";
import { MedicionWindowQueryDTO } from "../dto/medicion/medicion-window-query.dto";
import { MedicionService } from "../services/medicion.service";
import { MedicionValidator } from "../validators/medicion.validator";

interface MedicionParams { equipoId: string; sensorId: string; }
interface SensorParams { sensorId: string; }
interface EquipoParams { equipoId: string; }

export class MedicionController {
  constructor(private readonly medicionService: MedicionService) {}

  getNested = async (req: Request<MedicionParams, {}, {}, MedicionQueryDTO>, res: Response, next: NextFunction) => {
    try { res.json(await this.medicionService.getByEquipoSensor(req.params.equipoId, req.params.sensorId, MedicionValidator.validateQuery(req.query))); }
    catch (error) { next(error); }
  };
  getNestedLast = async (req: Request<MedicionParams>, res: Response, next: NextFunction) => {
    try { res.json(await this.medicionService.getLast(req.params.equipoId, req.params.sensorId)); }
    catch (error) { next(error); }
  };
  getNestedRange = async (req: Request<MedicionParams, {}, {}, MedicionRangeQueryDTO>, res: Response, next: NextFunction) => {
    try { res.json(await this.medicionService.getByRange(req.params.equipoId, req.params.sensorId, MedicionValidator.validateRange(req.query))); }
    catch (error) { next(error); }
  };
  getNestedWindow = async (req: Request<MedicionParams, {}, {}, MedicionWindowQueryDTO>, res: Response, next: NextFunction) => {
    try { res.json(await this.medicionService.getByWindow(req.params.equipoId, req.params.sensorId, MedicionValidator.validateWindow(req.query))); }
    catch (error) { next(error); }
  };

  getAll = async (req: Request<{}, {}, {}, MedicionQueryDTO>, res: Response, next: NextFunction) => {
    try { res.json(await this.medicionService.getAll(MedicionValidator.validateQuery(req.query))); }
    catch (error) { next(error); }
  };
  getLastPerSensor = async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json(await this.medicionService.getLastPerSensor()); } catch (error) { next(error); }
  };
  getBySensor = async (req: Request<SensorParams, {}, {}, MedicionQueryDTO>, res: Response, next: NextFunction) => {
    try { res.json(await this.medicionService.getBySensor(req.params.sensorId, MedicionValidator.validateQuery(req.query))); }
    catch (error) { next(error); }
  };
  getLastBySensor = async (req: Request<SensorParams>, res: Response, next: NextFunction) => {
    try { res.json(await this.medicionService.getLastBySensor(req.params.sensorId)); } catch (error) { next(error); }
  };
  getBySensorAndRange = async (req: Request<SensorParams, {}, {}, MedicionRangeQueryDTO>, res: Response, next: NextFunction) => {
    try { res.json(await this.medicionService.getBySensorAndRange(req.params.sensorId, MedicionValidator.validateRange(req.query))); }
    catch (error) { next(error); }
  };
  getBySensorAndWindow = async (req: Request<SensorParams, {}, {}, MedicionWindowQueryDTO>, res: Response, next: NextFunction) => {
    try { res.json(await this.medicionService.getBySensorAndWindow(req.params.sensorId, MedicionValidator.validateWindow(req.query))); }
    catch (error) { next(error); }
  };
  getLastByEquipo = async (req: Request<EquipoParams>, res: Response, next: NextFunction) => {
    try { res.json(await this.medicionService.getLastByEquipo(req.params.equipoId)); } catch (error) { next(error); }
  };
}
