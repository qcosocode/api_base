import { Request, Response } from 'express';
import { MedicionService } from '../services/medicion.service';
import {
  GetAllMedicionesQuery,
  GetBySensorAndRangeQuery,
  GetBySensorAndWindowQuery,
} from '../interfaces/medicion.interface';

/*
  equpos/equiposId?inclui => la ultima medicion de los sensores de ese equipo 
  equipos/equipoId/sensores/sensorId/mediciones/ => medicion.controller.ts  => 
  // limite / 
  mediciones/  => medicion.controller 

  analiticas/mediciones/  analitica.contrller => medicion.services => 

*/





export class MedicionController {

  constructor( private service : MedicionService) {

  }
  // GET /mediciones

  getAll = async (req: Request, res : Response) => {
         
     try {
         const result = await this.service.getAll(req.query as any);   // req.query lleva filtros,
         console.log(req.query)
         res.json(result);
     }   catch(err) {
         console.error(err)
         res.status(500).json({message : "Error interno"})
     }}
  

  //  GET /mediciones/ultima    

  getLastPerSensor = async( req: Request, res: Response) => {
    try{
        const result = await this.service.getLastPerSensor();
        res.json(result);
    }   catch(err) {
        console.error(err)
        res.status(500).json({message : "Error interno"})
    }
  }
  
  getBySensor = async( req:Request , res: Response) =>{
    const sensorId = String(req.params.sensorId);
    try{

       const result = await this.service.getBySensor(sensorId, req.query)
       res.json(result);
    }  catch(err){
       console.error(err)
       res.status(500).json({ message: "Error interno" });
    }
  }

   getLastBySensor = async (req: Request, res: Response) => {
    const sensorId = String(req.params.sensorId);
    try {
      res.json(await this.service.getLastBySensor(sensorId));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error interno" });
    }
  };

  getBySensorAndRange = async (req: Request, res: Response) => {
    const sensorId = String(req.params.sensorId);
    try {
      
      res.json(
        await this.service.getBySensorAndRange(
          sensorId,
          req.query as any
        )
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error interno" });
    }
  };

  getBySensorAndWindow = async (req: Request, res: Response) => {
     const sensorId = String(req.params.sensorId);
    try {
      res.json(
        await this.service.getBySensorAndWindow(
          sensorId,
          req.query as any
        )
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error interno" });
    }
  };

  getLastByEquipo = async (req: Request, res: Response) => {
    try {
      const  equipoId = String(req.params.equipoId)
      res.json(await this.service.getLastByEquipo(equipoId));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error interno" });
    }
  };



}
