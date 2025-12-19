import { Router } from 'express'
import { OfferedCourseController } from './offeredCourse.controller'
import validateRequest from '../../middlewares/validateRequest'
import { OfferedCourseValidation } from './offeredCourse.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = Router()

router.get('/', OfferedCourseController.getAllOfferedCourses)
router.get('/:id', OfferedCourseController.getSingleOfferedCourse)
router.post(
  '/create-offered-course',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(OfferedCourseValidation.createOfferedCourseValidationSchema),
  OfferedCourseController.createOfferedCourse,
)
router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(OfferedCourseValidation.updateOfferedCourseValidationSchema),
  OfferedCourseController.updateOfferedCourse,
)

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OfferedCourseController.deleteOfferedCourse,
)

export const OfferedCourseRoutes = router
