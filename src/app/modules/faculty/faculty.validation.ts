import { z } from 'zod'
import { BloodGroup, Gender } from './faculty.constant'

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

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    faculty: z.object({
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
      academicDepartment: z.string(),
      academicFaculty: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
})

const updateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
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
      academicDepartment: z.string().optional(),
      admissionFaculty: z.string().optional(),
      profileImg: z.string().optional(),
    }),
  }),
})

export const facultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
}
