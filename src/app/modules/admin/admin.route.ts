import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { FacultyControllers } from './admin.controller'
import { adminValidations } from './admin.validation'

const router = express.Router()

router.get('/', FacultyControllers.getFaculties)
router.get('/:facultyId', FacultyControllers.getSingleFaculty)
router.patch(
  '/:facultyId',
  validateRequest(adminValidations.updateFacultyValidationSchema),
  FacultyControllers.updateSingleFaculty,
)
router.delete('/:facultyId', FacultyControllers.deleteSingleFaculty)

export const FacultyRoutes = router
