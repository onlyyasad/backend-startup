import { z } from 'zod'
import { Days } from './offeredCourse.constant'

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum(Days as [string, ...string[]])),
      startTime: z.string().refine(
        (val) => {
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
          return timeRegex.test(val)
        },
        { message: 'Invalid time format. Expected HH:MM in 24-hour format' },
      ),
      endTime: z.string().refine(
        (val) => {
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
          return timeRegex.test(val)
        },
        { message: 'Invalid time format. Expected HH:MM in 24-hour format' },
      ),
    })
    .refine(
      (data) => {
        const startDateString = `1970-01-01T${data.startTime}:00Z`
        const endDateString = `1970-01-01T${data.endTime}:00Z`
        const startDate = new Date(startDateString)
        const endDate = new Date(endDateString)
        return endDate > startDate
      },
      { message: 'endTime must be later than startTime' },
    ),
})

const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().optional(),
    days: z.array(z.enum(Days as [string, ...string[]])).optional(),
    startTime: z
      .string()
      .refine(
        (val) => {
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
          return timeRegex.test(val)
        },
        { message: 'Invalid time format. Expected HH:MM in 24-hour format' },
      )
      .optional(),
    endTime: z
      .string()
      .refine(
        (val) => {
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
          return timeRegex.test(val)
        },
        { message: 'Invalid time format. Expected HH:MM in 24-hour format' },
      )
      .optional(),
  }),
})

export const OfferedCourseValidation = {
  createOfferedCourseValidationSchema,
}
