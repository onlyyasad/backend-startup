import { Router } from 'express'
import { OfferedCourseController } from './offeredCourse.controller'

const router = Router()

router.get('/', OfferedCourseController.getAllOfferedCourses)
router.get('/:id', OfferedCourseController.getSingleOfferedCourse)
router.post(
  '/create-offered-course',
  OfferedCourseController.createOfferedCourse,
)
router.patch('/:id', OfferedCourseController.updateOfferedCourse)

export const OfferedCourseRoutes = router
