import { z } from 'zod'

const createEnrolledCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: z.string(),
  }),
})

const updateEnrolledCourseMarksValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    offeredCourse: z.string(),
    student: z.string(),
    courseMarks: z.object({
      classTest1: z.number().min(0).max(10).optional(),
      midTerm: z.number().min(0).max(30).optional(),
      classTest2: z.number().min(0).max(10).optional(),
      finalTerm: z.number().min(0).max(50).optional(),
    }),
  }),
})

export const EnrolledCourseValidations = {
  createEnrolledCourseValidationSchema,
  updateEnrolledCourseMarksValidationSchema,
}
