


import { Entity, PrimaryColumn, Column , OneToMany , ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, PrimaryGeneratedColumn} from "typeorm"
import { Sensor } from "./sensor"
import { PuntoMonitoreo } from './punto-monitoreo';
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Entity({ name: 'equipos' })
export class Equipo {

    @PrimaryGeneratedColumn("uuid", { name: "equipo_id" })
    equipoId: string;

    @Column()
    nombre : String;
    
    @Column({ nullable: true })
    modelo?: string;

    @Column({ nullable: true })
    descripcion?: string;

    @OneToMany(() => Sensor, sensor => sensor.equipo)
    sensores: Sensor[]

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;
     
    @Column({ name: 'punto_monitoreo_id', type: 'uuid', nullable: true })
    puntoMonitoreoId!: string|null;

    @ManyToOne(() => PuntoMonitoreo, (p) => p.equipos, {
    onDelete: 'SET NULL',   // 👈 coherente con opcional
    onUpdate: 'CASCADE',
    nullable: true,
  })
    @JoinColumn({ name: 'punto_monitoreo_id' })
    puntoMonitoreo!: PuntoMonitoreo;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt!: Date;
    
}