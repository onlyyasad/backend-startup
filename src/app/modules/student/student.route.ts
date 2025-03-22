import express from 'express'
import { StudentControllers } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { studentValidations } from './student.validation'

const router = express.Router()

router.get('/', StudentControllers.getStudents)
router.get('/:studentId', StudentControllers.getSingleStudent)
router.patch(
  '/:studentId',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateSingleStudent,
)
router.delete('/:studentId', StudentControllers.deleteSingleStudent)

export const StudentRoutes = router
