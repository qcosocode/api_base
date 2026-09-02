
/* Repositorio Base donde se agrupan los metodos genericos basicos de un CRUD  */


import { Repository, ObjectLiteral , DeepPartial } from "typeorm";  // sin OBjectLiteral typeORM no entiende 

/* 
T es un genérico pero para TypeORM debe ser un objectliteral 
<T extends ObjectLiteral>



El error:

Type 'T[]' is not assignable to type 'T'.

viene de acá porque para TypeORM:

repository.create(...) puede devolver T o T[]

repository.save(...) también puede devolver T o T[]

TypeScript ve que create(data) podría ser T | T[], y entonces save(entity) también podría devolver T | T[]. Pero vos prometés Promise<T>, y ahí explota.

🔍 ¿Por qué pasa esto?

Las firmas simplificadas de TypeORM son más o menos así:

create(entityLike: DeepPartial<T>): T;
create(entityLikeArray: DeepPartial<T>[]): T[];

save(entity: T): Promise<T>;
save(entities: T[]): Promise<T[]>;


Como data es Partial<T>, TypeScript no puede descartar que en algún momento le pases un array, así que combina las sobrecargas y termina infiriendo:

const entity: T | T[] = this.ormRepository.create(data);
const saved: T | T[] = await this.ormRepository.save(entity);


Y eso no matchea con Promise<T>.






*/
/* Definimos una Interfaz  */

export interface IBaseRepository <T extends ObjectLiteral> {

    findAll(q:any): Promise <T[]>;

    findById(id: any) : Promise <T | null> ;

    create(data: DeepPartial<T>): Promise<T>;

    update(id: any, data: DeepPartial<T>): Promise<T | null>;

    delete(id: any): Promise<boolean>;

}

/**
 * Implementación base que envuelve al Repository de TypeORM.
 * Las clases de repositorio concreto la extenderán.
 */
export abstract class BaseRepository<T extends ObjectLiteral> implements IBaseRepository<T> {
  protected readonly ormRepository: Repository<T>;

  constructor(ormRepository: Repository<T>) {
    this.ormRepository = ormRepository;
  }

  async findAll(q:any): Promise<T[]> {
    return this.ormRepository.find(q);
  }

  async findById(id: any): Promise<T | null> {
    const entity = await this.ormRepository.findOne({ where: { id } as any });
    return entity ?? null;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.ormRepository.create(data);
    return await this.ormRepository.save(entity);
  }

  async update(id: any, data: DeepPartial<T>): Promise<T | null> {
    const entity = await this.findById(id);
    if (!entity) return null;

    const merged = this.ormRepository.merge(entity, data);
    return await this.ormRepository.save(merged);
  }

  async delete(id: any): Promise<boolean> {
    const result = await this.ormRepository.delete(id);
      return result.affected != null && result.affected > 0;
  }
}
