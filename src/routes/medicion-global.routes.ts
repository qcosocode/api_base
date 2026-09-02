import { Router } from "express";
import { createMedicionModule } from "../composition-root/medicion.composition-root";

const router = Router();
const { medicionController } = createMedicionModule();

router.get("/", medicionController.getAll);
router.get("/ultima", medicionController.getLastPerSensor);
router.get("/sensor/:sensorId", medicionController.getBySensor);
router.get("/sensor/:sensorId/ultima", medicionController.getLastBySensor);
router.get("/sensor/:sensorId/rango", medicionController.getBySensorAndRange);
router.get("/sensor/:sensorId/window", medicionController.getBySensorAndWindow);
router.get("/equipo/:equipoId/ultima", medicionController.getLastByEquipo);

export default router;
