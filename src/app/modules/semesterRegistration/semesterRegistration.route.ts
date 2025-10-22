import { Router } from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { SemesterRegistrationValidation } from './semesterRegistration.validation'
import { SemesterRegistrationController } from './semesterRegistration.controller'

const router = Router()

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
)

router.get('/', SemesterRegistrationController.getAllSemesterRegistrations)
router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistrations,
)

export const SemesterRegistrationRoutes = router
