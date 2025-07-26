import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { CourseValidation } from './course.validation'
import { CourseControllers } from './course.controller'

const router = express.Router()

router.post(
  '/create-course',
  validateRequest(CourseValidation.createCourseValidationSchema),
  CourseControllers.createCourse,
)

router.get('/', CourseControllers.getAllCourses)

router.get('/:id', CourseControllers.getSingleCourse)

router.patch(
  '/:id',
  validateRequest(CourseValidation.updateCourseValidationSchema),
  CourseControllers.updateCourse,
)

router.put('/:courseId/assign-faculties')

router.delete('/:id', CourseControllers.deleteSingleCourse)

export const CourseRoutes = router
