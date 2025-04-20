import { z } from 'zod'
import { BloodGroup, Gender } from './admin.constant'

const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(3, 'First Name must be at least 3 characters long.')
    .max(20, 'First Name is too long.')
    .refine(
      (value) => {
        const char = value.charAt(0).toUpperCase()
        const rest = value.slice(1).toLowerCase()
        return value === char + rest
      },
      { message: 'First Name is not properly formatted.' },
    ),
  middleName: z.string().optional(),
  lastName: z.string().regex(/^[A-Za-z]+$/, 'Last Name is not valid.'),
})

const updateUserNameValidationSchema = createUserNameValidationSchema.partial()

const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    admin: z.object({
      name: createUserNameValidationSchema,
      designation: z.string().min(1, 'Designation is required'),
      gender: z.enum([...Gender] as [string, ...string[]]),
      dateOfBirth: z.string().optional(),
      email: z.string().email('Invalid email'),
      contactNo: z.string().min(1, 'Contact number is required'),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency contact number is required'),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().min(1, 'Present address is required'),
      permanentAddress: z.string().min(1, 'Permanent address is required'),
      profileImg: z.string().optional(),
    }),
  }),
})

const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      name: updateUserNameValidationSchema.optional(),
      designation: z.string().min(1, 'Designation is required').optional(),
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email('Invalid email').optional(),
      contactNo: z.string().min(1, 'Contact number is required').optional(),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency contact number is required')
        .optional(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z
        .string()
        .min(1, 'Present address is required')
        .optional(),
      permanentAddress: z
        .string()
        .min(1, 'Permanent address is required')
        .optional(),
      profileImg: z.string().optional(),
    }),
  }),
})

export const adminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
}
