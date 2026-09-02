import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EquipoEntity } from "./equipo.entity";
import { MedicionEntity } from "./medicion.entity";

@Entity({ name: "sensores" })
export class SensorEntity {
  @PrimaryGeneratedColumn("uuid", { name: "sensor_id" })
  sensorId: string;

  @Column()
  nombre: string;

  @Column()
  codigoPCB: string;

  @Column()
  tipo: string;

  @Column()
  modelo: string;

  @Column()
  unidad: string;

  @Column({ default: true })
  is_on: boolean;

  @ManyToOne(() => EquipoEntity, equipo => equipo.sensores, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "equipo_id" })
  equipo: EquipoEntity;

  @OneToMany(() => MedicionEntity, medicion => medicion.sensor)
  mediciones: MedicionEntity[];
}
