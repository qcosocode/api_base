
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, PrimaryColumn } from "typeorm"
import {
  Hypertable, TimeColumn } from "@timescaledb/typeorm";
import { Sensor }  from "./sensor"

@Index('idx_medicion_sensor_time', ['sensor_id', 'time'])
@Hypertable({
  // Opciones propias de TimescaleDB
  // 
  compression: {
    compress: true,
    compress_orderby: 'time',
    compress_segmentby: 'sensor_id',
    policy: {
      schedule_interval: '1 day',
    },
  },
})



//@Entity({ name: 'mediciones' })
@Entity({ name: 'mediciones' })
export class Medicion {

 
    @PrimaryColumn({ type: "varchar" })
    sensor_id!: string;
  
    @PrimaryColumn({ type: "timestamptz" })
    @TimeColumn()
    time!: Date;

    @Column({ type: 'double precision' })
    valor!: number;
    
    

    @ManyToOne(() => Sensor, sensor => sensor.mediciones,   // Navegabilidad => la entidad Sensor tendra un array de mediciones 
    {
         onDelete: "CASCADE",
         onUpdate: "CASCADE",
    })
    @JoinColumn({name:"sensor_id"})
    sensor!: Sensor

}