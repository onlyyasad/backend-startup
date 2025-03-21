import { z } from 'zod'

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(4, 'First Name must be at least 4 characters long.')
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

const guardianValidationSchema = z.object({
  fatherName: z.string().min(1, 'Father name is required'),
  fatherOccupation: z.string().min(1, 'Father occupation is required'),
  fatherContactNo: z.string().min(1, 'Father contact number is required'),
  motherName: z.string().min(1, 'Mother name is required'),
  motherOccupation: z.string().min(1, 'Mother occupation is required'),
  motherContactNo: z.string().min(1, 'Mother contact number is required'),
})

const localGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local guardian name is required'),
  occupation: z.string().min(1, 'Local guardian occupation is required'),
  contactNo: z.string().min(1, 'Local guardian contact number is required'),
  address: z.string().min(1, 'Local guardian address is required'),
})

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['male', 'female', 'other'], {
        errorMap: () => ({
          message: "Gender must be 'male', 'female', or 'other'.",
        }),
      }),
      dateOfBirth: z.string().optional(),
      email: z.string().email('Invalid email'),
      contactNo: z.string().min(1, 'Contact number is required'),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency contact number is required'),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
        errorMap: () => ({ message: 'Invalid blood group.' }),
      }),
      presentAddress: z.string().min(1, 'Present address is required'),
      permanentAddress: z.string().min(1, 'Permanent address is required'),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      admissionSemester: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
})

export const studentValidations = {
  createStudentValidationSchema,
}
