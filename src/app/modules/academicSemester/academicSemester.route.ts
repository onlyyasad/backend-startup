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
router.get('/:id', AcademicSemesterControllers.getSingleAcademicSemester)
router.patch('/:id', AcademicSemesterControllers.updateSingleAcademicSemester)

export const AcademicSemesterRoutes = router
