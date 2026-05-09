import { Router } from "express";
import { createSensorModule } from "../composition-root/sensor.composition-root";

const router = Router();

const { sensorController } = createSensorModule();

/**
 * @swagger
 * tags:
 *   name: Sensores
 *   description: Gestión de sensores
 */

/**
 * @swagger
 * /sensores:
 *   get:
 *     summary: Obtener todos los sensores
 *     tags: [Sensores]
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
 *         name: equipoId
 *         schema:
 *           type: string
 *         description: Filtrar por equipo
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: Tipo de sensor (ej: temperatura, ECG, etc.)
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Estado del sensor
 *     responses:
 *       200:
 *         description: Lista de sensores
 *       500:
 *         description: Error interno
 */
router.get("/", sensorController.getAll);

/**
 * @swagger
 * /sensores:
 *   post:
 *     summary: Crear un sensor
 *     tags: [Sensores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sensorId
 *               - tipo
 *               - equipoId
 *             properties:
 *               sensorId:
 *                 type: string
 *                 example: "SEN-001"
 *               tipo:
 *                 type: string
 *                 example: "temperatura"
 *               unidad:
 *                 type: string
 *                 example: "°C"
 *               equipoId:
 *                 type: string
 *                 example: "EQ-001"
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Sensor creado correctamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Sensor ya existe
 */
router.post("/", sensorController.createSensor);

/**
 * @swagger
 * /sensores/{sensorId}:
 *   get:
 *     summary: Obtener un sensor por ID
 *     tags: [Sensores]
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sensor encontrado
 *       404:
 *         description: Sensor no encontrado
 */
router.get("/:sensorId", sensorController.getSensorById);

/**
 * @swagger
 * /sensores/{sensorId}:
 *   put:
 *     summary: Actualizar un sensor
 *     tags: [Sensores]
 *     parameters:
 *       - in: path
 *         name: sensorId
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
 *               tipo:
 *                 type: string
 *               unidad:
 *                 type: string
 *               activo:
 *                 type: boolean
 *               equipoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sensor actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Sensor no encontrado
 */
router.put("/:sensorId", sensorController.updateSensor);

/**
 * @swagger
 * /sensores/{sensorId}:
 *   delete:
 *     summary: Eliminar un sensor
 *     tags: [Sensores]
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Sensor eliminado correctamente
 *       404:
 *         description: Sensor no encontrado
 */
router.delete("/:sensorId", sensorController.deleteSensor);

export default router;