import { Router } from "express";
import { createEquipoModule } from "../composition-root/equipo.composition-root";

const router = Router();
const { equipoController } = createEquipoModule();

/**
 * @swagger
 * tags:
 *   name: Equipos
 *   description: Gestión de equipos
 */

/**
 * @swagger
 * /equipos:
 *   get:
 *     summary: Obtener lista de equipos
 *     tags: [Equipos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 50
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *       - in: query
 *         name: modelo
 *         schema:
 *           type: string
 *       - in: query
 *         name: punto_monitoreo_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de equipos
 */
router.get("/", equipoController.getAll);

/**
 * @swagger
 * /equipos/{equipoId}:
 *   get:
 *     summary: Obtener equipo por ID
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: equipoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipo encontrado
 *       404:
 *         description: Equipo no encontrado
 */
router.get("/:equipoId", equipoController.getById);

/**
 * @swagger
 * /equipos:
 *   post:
 *     summary: Crear un equipo
 *     tags: [Equipos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - equipoId
 *               - nombre
 *             properties:
 *               equipoId:
 *                 type: string
 *               nombre:
 *                 type: string
 *               modelo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               puntoMonitoreoId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Equipo creado
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Equipo ya existe
 */
router.post("/", equipoController.create);

/**
 * @swagger
 * /equipos/{equipoId}:
 *   put:
 *     summary: Actualizar un equipo
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: equipoId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               modelo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               puntoMonitoreoId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Equipo actualizado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Equipo no encontrado
 */
router.put("/:equipoId", equipoController.update);

/**
 * @swagger
 * /equipos/{equipoId}:
 *   delete:
 *     summary: Eliminar un equipo
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: equipoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Eliminado correctamente
 *       404:
 *         description: Equipo no encontrado
 */
router.delete("/:equipoId", equipoController.delete);

/**
 * @swagger
 * /equipos/{equipoId}/punto-monitoreo:
 *   put:
 *     summary: Asignar o quitar punto de monitoreo
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: equipoId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               puntoMonitoreoId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Punto asignado correctamente
 *       404:
 *         description: Equipo no encontrado
 */
router.put("/:equipoId/punto-monitoreo", equipoController.assignPunto);

export default router;