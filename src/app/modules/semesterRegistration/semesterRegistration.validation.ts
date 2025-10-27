import { z } from 'zod'
import { SemesterRegistrationStatus } from './semesterRegistration.constant'

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string({
      required_error: 'Academic Semester is required',
    }),
    status: z.enum(SemesterRegistrationStatus).optional(),
    startDate: z.string({
      required_error: 'Start Date is required',
    }),
    endDate: z.string({
      required_error: 'End Date is required',
    }),
    minCredit: z
      .number({
        required_error: 'Minimum Credit is required',
      })
      .min(3, 'Minimum Credit must be at least 3'),
    maxCredit: z
      .number({
        required_error: 'Maximum Credit is required',
      })
      .max(16, 'Maximum Credit must be at most 16'),
  }),
})

const updateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z.enum(SemesterRegistrationStatus).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minCredit: z
      .number()
      .min(3, 'Minimum Credit must be at least 3')
      .optional(),
    maxCredit: z
      .number()
      .max(16, 'Maximum Credit must be at most 16')
      .optional(),
  }),
})

export const SemesterRegistrationValidation = {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
}
