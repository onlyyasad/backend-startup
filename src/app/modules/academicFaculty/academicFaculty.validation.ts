import { z } from 'zod'

const academicFacultyCreateValidationSchema = z.object({
  name: z.string({
    invalid_type_error: 'Academic Faculty must be string.',
  }),
})

export const AcademicFacultyValidation = {
  academicFacultyCreateValidationSchema,
}
