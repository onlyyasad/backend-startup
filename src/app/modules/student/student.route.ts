import express from 'express'
import { StudentControllers } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { studentValidations } from './student.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentControllers.getStudents,
)
router.get(
  '/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.admin,
    USER_ROLE.faculty,
  ),
  StudentControllers.getSingleStudent,
)
router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateSingleStudent,
)
router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentControllers.deleteSingleStudent,
)

export const StudentRoutes = router
