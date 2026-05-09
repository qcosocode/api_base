
import  {Entity , PrimaryColumn , Column , ManyToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import  { Equipo } from "./equipo"
import  { Medicion } from "./medicion";
 
@Entity({ name: 'sensores' })
export class Sensor{

   @PrimaryGeneratedColumn("uuid", { name: "sensor_id" })
   sensorId : string;

   @Column()
   nombre : string;   // que mide "temperatura_ambiente", "nivel_tanque", "apertura_puerta"

   @Column()
   codigoPCB: string;  // asocia la etiqueta en el HW como ser V1 , P1 

   @Column()
   tipo: string;

   @Column()
   modelo: string;      // MPX, DS18B20

   @Column()
   unidad : string;     

   @Column({default : true })
   is_on : boolean;

   @ManyToOne(() => Equipo, equipo => equipo.sensores , 
    {
     onDelete: "CASCADE",
     onUpdate: "CASCADE",
    })
    @JoinColumn({name:"equipo_id"})
    equipo : Equipo;

    @OneToMany(() => Medicion, medicion => medicion.sensor)
    mediciones : Medicion[] 

}