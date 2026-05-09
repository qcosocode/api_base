/* Debe definir bien una sala o area dentro de la institución  */



import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Institucion } from './institucion';
import { Equipo } from './equipo';

@Entity({ name: 'puntos_monitoreo' })
export class PuntoMonitoreo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_punto_monitoreo_nombre')
  @Column({ type: 'varchar', length: 150 })
  nombre!: string;
  // "Cámara frigorífica 1", "Panel de gases Quirófano 2", "Tablero Sala Bombas"

  @Column({ type: 'varchar', length: 150, nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  categoria?: string;

  // FK explícita hacia Institucion
  @Column({ name: 'institucion_id', type: 'uuid' })
  institucionId!: string;

  @ManyToOne(() => Institucion, (i) => i.puntosMonitoreo, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'institucion_id' })
  institucion!: Institucion;

  // Relación con Equipo: un punto puede tener N equipos
  @OneToMany(() => Equipo, (e) => e.puntoMonitoreo)
  equipos!: Equipo[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
