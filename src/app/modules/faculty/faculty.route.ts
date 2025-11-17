import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { FacultyControllers } from './faculty.controller'
import { facultyValidations } from './faculty.validation'
import auth from '../../middlewares/auth'

const router = express.Router()

router.get('/', auth(), FacultyControllers.getFaculties)
router.get('/:id', FacultyControllers.getSingleFaculty)
router.patch(
  '/:id',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateSingleFaculty,
)
router.delete('/:id', FacultyControllers.deleteSingleFaculty)

export const FacultyRoutes = router
