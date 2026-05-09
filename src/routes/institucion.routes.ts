// src/routes/institucion.routes.ts

import { Router } from "express";
import { createInstitucionModule } from "../composition-root/institucion.composition-root";

const router = Router();

const { institucionController } = createInstitucionModule();

// GET /instituciones
router.get("/", institucionController.getAll);

// GET /instituciones/:id
router.get("/:id", institucionController.getById);

// POST /instituciones
router.post("/", institucionController.create);

// PUT /instituciones/:id
router.put("/:id", institucionController.update);

// DELETE /instituciones/:id
router.delete("/:id", institucionController.delete);

export default router;