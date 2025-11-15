import { Router } from 'express'
import { OfferedCourseController } from './offeredCourse.controller'
import validateRequest from '../../middlewares/validateRequest'
import { OfferedCourseValidation } from './offeredCourse.validation'

const router = Router()

router.get('/', OfferedCourseController.getAllOfferedCourses)
router.get('/:id', OfferedCourseController.getSingleOfferedCourse)
router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidation.createOfferedCourseValidationSchema),
  OfferedCourseController.createOfferedCourse,
)
router.patch(
  '/:id',
  validateRequest(OfferedCourseValidation.updateOfferedCourseValidationSchema),
  OfferedCourseController.updateOfferedCourse,
)

router.delete('/:id', OfferedCourseController.deleteOfferedCourse)

export const OfferedCourseRoutes = router
