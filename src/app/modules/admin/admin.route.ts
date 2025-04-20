import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AdminControllers } from './admin.controller'
import { adminValidations } from './admin.validation'

const router = express.Router()

router.get('/', AdminControllers.getFaculties)
router.get('/:facultyId', AdminControllers.getSingleFaculty)
router.patch(
  '/:facultyId',
  validateRequest(adminValidations.updateFacultyValidationSchema),
  AdminControllers.updateSingleFaculty,
)
router.delete('/:facultyId', AdminControllers.deleteSingleFaculty)

export const FacultyRoutes = router
