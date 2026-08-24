import { Request, Response } from "express";
import { SensorService } from "../services/sensor.service";
import { GetSensorsInput, PaginatedResponse, SensorCreateDTO, SensorQueryDTO, SensorUpdateDTO } from "../interfaces/sensor.interface.interface";
import { parsePage, parseLimit, parseBool } from "../http/query.parser";

interface SensorRouteParams {
  equipoId?: string;
  sensorId?: string;
}

/*
   Si esto es equipo.sensor.controller.ts equipos/equipoId/sensores/ => raiz /sensorId 
                                                                             /...
   
   todos los metodos deben recibir equipoId y sensorId 

   validar que el equipo exista  getEquipoId => true o false con un metodo en el repositorio 

   Equipo.sensores => la lista de sensores, uso un find 


   Equipo.Modelo => template base pro 





*/



export class SensorController {

     constructor(private service : SensorService) {}

     
     
 
      // GET /sensores

      getAll = async (req: Request<SensorRouteParams, {}, {}, SensorQueryDTO>, res: Response) => {
        try {
          
           //Si yo parse en el controller que armo acá ? 

          //  const query: SensorQueryDTO = {
          //    page: req.query.page as string | undefined,
          //    limit: req.query.limit as string | undefined,
          //    equipoId: req.query.equipoId as string | undefined,
          //    tipo: req.query.tipo as string | undefined,
          //    activo: req.query.activo as string | undefined,
          //   };
            
            const page = parsePage(req.query.page);
            const limit = parseLimit(req.query.limit);
            const is_on = parseBool(req.query.activo);
            
            // validación simple de activo si viene

            if (req.query.activo !== undefined && req.query.activo !== "true" && req.query.activo !== "false") {
              return res.status(400).json({ message: "activo debe ser 'true' o 'false'" });
            }

            const input : GetSensorsInput = {
             page: page,
             limit: limit,
             equipoId: req.params.equipoId ?? req.query.equipoId,
             tipo: req.query.tipo as string | undefined,
             activo: is_on
             }
            
          // Service tiene que recibir sensorQueryDTO ? 

          const result = await this.service.getAll(input);
          return res.status(200).json(result);
        } catch (err: any) {
          return res.status(500).json({ message: err.message ?? "Error interno" });
        }
      };
    
      // POST /sensores
      createSensor = async (
        req: Request<SensorRouteParams, {}, Partial<SensorCreateDTO>>,
        res: Response
      ) => {
        try {
          const body = req.body;
    
          // required mínimos
          // permitir sensorId vacio => y generar id
          const required = ["nombre", "codigoPCB", "tipo", "modelo", "unidad"] as const;
          for (const k of required) {
            if (!body[k]) return res.status(400).json({ message: `Falta campo requerido: ${k}` });
          }

          const equipoId = req.params.equipoId ?? body.equipoId;
          if (!equipoId) {
            return res.status(400).json({ message: "Falta campo requerido: equipoId" });
          }
    
          const dto: SensorCreateDTO = {
          
            nombre: String(body.nombre),
            codigoPCB: String(body.codigoPCB),
            tipo: String(body.tipo),
            modelo: String(body.modelo),
            unidad: String(body.unidad),
            equipoId: String(equipoId),
            is_on: body.is_on === undefined ? undefined : Boolean(body.is_on),
          };
    
          const created = await this.service.createSensor(dto);
          return res.status(201).json(created);
        } catch (err: any) {
          // errores de regla de negocio => 409 o 400 según criterio
          const msg = err.message ?? "Error";
          if (msg.includes("Ya existe")) return res.status(409).json({ message: msg });
          return res.status(400).json({ message: msg });
        }
      };
    
      // GET /sensores/:sensorId
      getSensorById = async (req: Request<SensorRouteParams>, res: Response) => {
        try {
          const sensorId = String(req.params.sensorId)
          if (!sensorId) return res.status(400).json({ message: "sensorId es requerido" });
    
          const sensor = await this.service.getSensorById(sensorId, req.params.equipoId);
          return res.status(200).json(sensor);
        } catch (err: any) {
          const msg = err.message ?? "Error";
          if (msg.includes("no encontrado")) return res.status(404).json({ message: msg });
          return res.status(400).json({ message: msg });
        }
      };
    
      // PUT /sensores/:sensorId
      updateSensor = async (
        req: Request<SensorRouteParams, {}, SensorUpdateDTO>,
        res: Response
      ) => {
        try {
          const sensorId = String(req.params.sensorId);
          
          if (!sensorId) return res.status(400).json({ message: "sensorId es requerido" });
    
          const body = req.body;
    
          // validación simple: al menos 1 campo
          const hasAny =
            body.nombre !== undefined ||
            body.codigoPCB !== undefined ||
            body.tipo !== undefined ||
            body.modelo !== undefined ||
            body.unidad !== undefined ||
            body.is_on !== undefined ||
            body.equipoId !== undefined;
    
          if (!hasAny) return res.status(400).json({ message: "Body vacío: no hay campos para actualizar" });
          
          const updated = await this.service.updateSensor(
            sensorId,
            body,
            req.params.equipoId
          );
          return res.status(200).json(updated);
        } catch (err: any) {
          const msg = err.message ?? "Error";
          if (msg.includes("no encontrado")) return res.status(404).json({ message: msg });
          return res.status(400).json({ message: msg });
        }
      };
    
      // DELETE /sensores/:sensorId
      deleteSensor = async (req: Request<SensorRouteParams>, res: Response) => {
        try {
          const sensorId = String(req.params.sensorId);
          
          if (!sensorId) return res.status(400).json({ message: "sensorId es requerido" });
    
          await this.service.deleteSensor(sensorId, req.params.equipoId);
          return res.status(204).send();
        } catch (err: any) {
          const msg = err.message ?? "Error";
          if (msg.includes("no encontrado")) return res.status(404).json({ message: msg });
          return res.status(400).json({ message: msg });
        }
      };
    }






