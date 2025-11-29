import { Router } from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { EnrolledCourseValidations } from './enrolledCourse.validation'
import { EnrolledCourseController } from './enrolledCourse.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = Router()

router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.student),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationSchema,
  ),
  EnrolledCourseController.createEnrolledCourse,
)

router.patch(
  '/update-enrolled-course-marks',
  auth(USER_ROLE.faculty),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationSchema,
  ),
  EnrolledCourseController.updateEnrolledCourseMarks,
)

export const EnrolledCourseRoutes = router
