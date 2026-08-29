import { Medicion } from "../entities/medicion";
import { MedicionRepository } from "../repositories/medicion.repository";

import {
  GetAllMedicionesQuery,
  GetBySensorAndRangeQuery,
  GetBySensorAndWindowQuery,
  PaginatedResponse,
} from '../interfaces/medicion.interface';

export class MedicionService {
  
  constructor(private repo : MedicionRepository) {
   
  }

   getAll( query : GetAllMedicionesQuery) : Promise<PaginatedResponse<Medicion>> {
         return this.repo.findAllPaginated( query ); 
   }
   
   //mediciones/ultima 
   getLastPerSensor( ) : Promise<Medicion[]> {
         return this.repo.findLastPerSensor() ;
   }
   //mediciones/sensor/:sensorId
   getBySensor(sensorId: string , query : GetAllMedicionesQuery): Promise<PaginatedResponse<Medicion>>{
        return this.repo.findBySensorPaginated(sensorId, query);  
   }
    //mediciones/sensor/:sensorId
   getLastBySensor(sensorId : string ): Promise< Medicion|null> {
        return this.repo.findLastBySensor(sensorId);
   }

   getBySensorAndRange( sensorId: string, query: GetBySensorAndRangeQuery): Promise<Medicion[]> {
    return this.repo.findBySensorAndRange(sensorId, query);
  }

  getBySensorAndWindow( sensorId: string, query: GetBySensorAndWindowQuery ): Promise<Medicion[]> {
    return this.repo.findBySensorAndWindow(sensorId, query);
  }

  getLastByEquipo(equipoId: string): Promise<Medicion | null> {
    return this.repo.findLastByEquipo(equipoId);
  }
}
