import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { FacultyControllers } from './faculty.controller'
import { facultyValidations } from './faculty.validation'

const router = express.Router()

router.get('/', FacultyControllers.getFaculties)
router.get('/:facultyId', FacultyControllers.getSingleFaculty)
router.patch(
  '/:facultyId',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateSingleFaculty,
)
router.delete('/:facultyId', FacultyControllers.deleteSingleFaculty)

export const FacultyRoutes = router
