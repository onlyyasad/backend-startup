import { z } from 'zod'
import { BloodGroup, Gender } from './student.constant'

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

const createGuardianValidationSchema = z.object({
  fatherName: z.string().min(1, 'Father name is required'),
  fatherOccupation: z.string().min(1, 'Father occupation is required'),
  fatherContactNo: z.string().min(1, 'Father contact number is required'),
  motherName: z.string().min(1, 'Mother name is required'),
  motherOccupation: z.string().min(1, 'Mother occupation is required'),
  motherContactNo: z.string().min(1, 'Mother contact number is required'),
})

const updateGuardianValidationSchema = createGuardianValidationSchema.partial()

const createLocalGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local guardian name is required'),
  occupation: z.string().min(1, 'Local guardian occupation is required'),
  contactNo: z.string().min(1, 'Local guardian contact number is required'),
  address: z.string().min(1, 'Local guardian address is required'),
})

const updateLocalGuardianValidationSchema =
  createLocalGuardianValidationSchema.partial()

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: createUserNameValidationSchema,
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
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      academicDepartment: z.string(),
      admissionSemester: z.string(),
    }),
  }),
})

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameValidationSchema.optional(),
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
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      academicDepartment: z.string().optional(),
      admissionSemester: z.string().optional(),
    }),
  }),
})

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
}
