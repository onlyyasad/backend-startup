import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { CourseValidation } from './course.validation'
import { CourseControllers } from './course.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.post(
  '/create-course',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidation.createCourseValidationSchema),
  CourseControllers.createCourse,
)

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.faculty),
  CourseControllers.getAllCourses,
)

router.get('/:id', auth(USER_ROLE.admin), CourseControllers.getSingleCourse)

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidation.updateCourseValidationSchema),
  CourseControllers.updateCourse,
)

router.put(
  '/:courseId/assign-faculties',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidation.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
)

router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidation.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
)

router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  CourseControllers.deleteSingleCourse,
)

export const CourseRoutes = router
