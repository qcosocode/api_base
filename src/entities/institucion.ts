import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PuntoMonitoreo } from './punto-monitoreo';

@Entity({ name: 'instituciones' })
export class Institucion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  nombre!: string; // "Hospital Central", "Clínica San Martín"

  @Column({ type: 'varchar', length: 150, nullable: true })
  direccion?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono?: string;

  // Una institución puede tener N puntos de monitoreo
  @OneToMany(() => PuntoMonitoreo, (p) => p.institucion)
  puntosMonitoreo!: PuntoMonitoreo[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
