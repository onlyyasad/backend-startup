import express from 'express'
import { AcademicSemesterControllers } from './academicSemester.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicSemesterValidation } from './academicSemester.validation'

const router = express.Router()

router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
)

router.get('/', AcademicSemesterControllers.getAcademicSemesters)
router.get(
  '/:semesterId',
  validateRequest(
    AcademicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.getSingleAcademicSemester,
)
router.patch(
  '/:semesterId',
  AcademicSemesterControllers.updateSingleAcademicSemester,
)

export const AcademicSemesterRoutes = router
