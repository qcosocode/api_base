import { Router } from 'express';
import * as medicionCompositionRoot from '../composition-root/medicion.composition-root';

const router = Router();

const { medicionController } = medicionCompositionRoot.createMedicionModule();

/**
 * @swagger
 * tags:
 *   name: Mediciones
 *   description: Gestión de mediciones de sensores (time-series)
 */

/**
 * @swagger
 * /mediciones:
 *   get:
 *     summary: Obtener mediciones con paginación y filtros
 *     tags: [Mediciones]
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
 *         name: sensor_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: equipo_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T00:00:00Z"
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T01:00:00Z"
 *     responses:
 *       200:
 *         description: Lista de mediciones
 */
router.get('/', medicionController.getAll);

/**
 * @swagger
 * /mediciones/ultima:
 *   get:
 *     summary: Obtener última medición de cada sensor
 *     tags: [Mediciones]
 *     responses:
 *       200:
 *         description: Últimas mediciones por sensor
 */
router.get('/ultima', medicionController.getLastPerSensor);

/**
 * @swagger
 * /mediciones/sensor/{sensorId}:
 *   get:
 *     summary: Obtener mediciones por sensor
 *     tags: [Mediciones]
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mediciones del sensor
 */
router.get('/sensor/:sensorId', medicionController.getBySensor);

/**
 * @swagger
 * /mediciones/sensor/{sensorId}/ultima:
 *   get:
 *     summary: Obtener última medición de un sensor
 *     tags: [Mediciones]
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Última medición del sensor
 */
router.get('/sensor/:sensorId/ultima', medicionController.getLastBySensor);

/**
 * @swagger
 * /mediciones/sensor/{sensorId}/rango:
 *   get:
 *     summary: Obtener mediciones en un rango de tiempo
 *     tags: [Mediciones]
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Mediciones en el rango
 *       400:
 *         description: Parámetros inválidos
 */
router.get('/sensor/:sensorId/rango', medicionController.getBySensorAndRange);

/**
 * @swagger
 * /mediciones/sensor/{sensorId}/window:
 *   get:
 *     summary: Obtener mediciones en ventana de tiempo relativa
 *     description: Ejemplo: últimas X horas o minutos
 *     tags: [Mediciones]
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: minutes
 *         schema:
 *           type: integer
 *           example: 60
 *       - in: query
 *         name: hours
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Mediciones en la ventana
 */
router.get('/sensor/:sensorId/window', medicionController.getBySensorAndWindow);

/**
 * @swagger
 * /mediciones/equipo/{equipoId}/ultima:
 *   get:
 *     summary: Obtener última medición por equipo
 *     tags: [Mediciones]
 *     parameters:
 *       - in: path
 *         name: equipoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Última medición del equipo
 */
router.get('/equipo/:equipoId/ultima', medicionController.getLastByEquipo);

export default router;