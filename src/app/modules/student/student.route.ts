import express from 'express'
import { StudentControllers } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { studentValidations } from './student.validation'

const router = express.Router()

router.get('/', StudentControllers.getStudents)
router.get('/:id', StudentControllers.getSingleStudent)
router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateSingleStudent,
)
router.delete('/:id', StudentControllers.deleteSingleStudent)

export const StudentRoutes = router
