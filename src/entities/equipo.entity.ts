import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PuntoMonitoreo } from "./punto-monitoreo";
import { SensorEntity } from "./sensor.entity";

@Entity({ name: "equipos" })
export class EquipoEntity {
  @PrimaryGeneratedColumn("uuid", { name: "equipo_id" })
  equipoId: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  modelo?: string;

  @Column({ nullable: true })
  descripcion?: string;

  @OneToMany(() => SensorEntity, sensor => sensor.equipo)
  sensores: SensorEntity[];

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive: boolean;

  @Column({ name: "punto_monitoreo_id", type: "uuid", nullable: true })
  puntoMonitoreoId: string | null;

  @ManyToOne(() => PuntoMonitoreo, punto => punto.equipos, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "punto_monitoreo_id" })
  puntoMonitoreo: PuntoMonitoreo;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
