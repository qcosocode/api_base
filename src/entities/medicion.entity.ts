import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Hypertable, TimeColumn } from "@timescaledb/typeorm";
import { SensorEntity } from "./sensor.entity";

@Index("idx_medicion_sensor_time", ["sensor_id", "time"])
@Hypertable({
  compression: {
    compress: true,
    compress_orderby: "time",
    compress_segmentby: "sensor_id",
    policy: { schedule_interval: "1 day" },
  },
})
@Entity({ name: "mediciones" })
export class MedicionEntity {
  @PrimaryColumn({ type: "varchar" })
  sensor_id: string;

  @PrimaryColumn({ type: "timestamptz" })
  @TimeColumn()
  time: Date;

  @Column({ type: "double precision" })
  valor: number;

  @ManyToOne(() => SensorEntity, sensor => sensor.mediciones, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "sensor_id" })
  sensor: SensorEntity;
}
