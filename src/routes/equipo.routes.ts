import { Router } from "express";
import { createEquipoModule } from "../composition-root/equipo.composition-root";
import sensorRoutes from "./sensor.route";

const router = Router();
const { equipoController } = createEquipoModule();




router.get("/", equipoController.getAll);


router.get("/:equipoId", equipoController.getById);


router.post("/", equipoController.create);


router.put("/:equipoId", equipoController.update);


router.delete("/:equipoId", equipoController.delete);


router.put("/:equipoId/punto-monitoreo", equipoController.assignPunto);

router.use("/:equipoId/sensores", sensorRoutes);

export default router;
