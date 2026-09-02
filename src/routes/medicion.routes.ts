import { Router } from "express";
import { createMedicionModule } from "../composition-root/medicion.composition-root";

const router = Router({ mergeParams: true });
const { medicionController } = createMedicionModule();

router.get("/", medicionController.getNested);
router.get("/ultima", medicionController.getNestedLast);
router.get("/rango", medicionController.getNestedRange);
router.get("/window", medicionController.getNestedWindow);

export default router;
