import express from 'express'
import { UserControllers } from './user.controller'
import { studentValidations } from '../student/student.validation'
import validateRequest from '../../middlewares/validateRequest'
import { facultyValidations } from '../faculty/faculty.validation'
import { adminValidations } from '../admin/admin.validation'

const router = express.Router()

router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
)

router.post(
  '/create-faculty',
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
)

router.post(
  '/create-admin',
  validateRequest(adminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
)
export const UserRoutes = router
