import { Schema, model } from 'mongoose'
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  TStudentModel,
  TUserName,
} from './student.interface'
import validator from 'validator'
import bcrypt from 'bcrypt'
import config from '../../config'

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    minlength: [4, 'First Name must be at least 4 characters long.'],
    maxlength: [20, 'First Name is too long.'],
    required: [true, 'First name is required'],
    trim: true,
    validate: {
      validator: function (value: string) {
        const char = value.charAt(0).toUpperCase()
        const rest = value.slice(1).toLowerCase()
        const name = char + rest
        return value === name
      },
      message: '{VALUE} is not valid.',
    },
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    validate: {
      validator: (value: string) => {
        return validator.isAlpha(value)
      },
      message: '{VALUE} is not valid.',
    },
    required: [true, 'Last name is required'],
  },
})

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father name is required'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father occupation is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father contact number is required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother name is required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother contact number is required'],
  },
})

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local guardian name is required'],
  },
  occupation: {
    type: String,
    required: [true, 'Local guardian occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local guardian contact number is required'],
  },
  address: {
    type: String,
    required: [true, 'Local guardian address is required'],
  },
})

const studentSchema = new Schema<TStudent, TStudentModel>({
  id: {
    type: String,
    unique: true,
    required: [true, 'Student ID is required'],
  },
  password: {
    type: String,
    maxlength: [20, 'Password is too long.'],
    required: true,
  },
  name: {
    type: userNameSchema,
    required: [true, 'Student name is required'],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message:
        "{VALUE} is not supported, use 'male', 'female' or 'other' instead",
    },
    required: [true, 'Gender is required'],
  },
  dateOfBirth: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: (value: string) => {
        return validator.isEmail(value)
      },
      message: '{VALUE} is not a valid email.',
    },
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required'],
  },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency contact number is required'],
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message:
        "{VALUE} is not supported, please use 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', or 'O-' instead",
    },
    required: [true, 'Blood group is required'],
  },
  presentAddress: {
    type: String,
    required: [true, 'Present address is required'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required'],
  },
  guardian: {
    type: guardianSchema,
    required: [true, 'Guardian information is required'],
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, 'Local guardian information is required'],
  },
  profileImg: {
    type: String,
  },
  isActive: {
    type: String,
    enum: {
      values: ['active', 'blocked'],
      message: "{VALUE} is not supported, use 'active' or 'blocked' instead.",
    },
    default: 'active',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id })
  return existingUser
}

studentSchema.pre('save', async function (next) {
  const student = this
  student.password = await bcrypt.hash(
    student.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

studentSchema.post('save', async function (doc, next) {
  const student = doc
  student.password = ''
  next()
})

studentSchema.pre('findOne', async function (next) {
  this.findOne({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

export const Student = model<TStudent, TStudentModel>('Student', studentSchema)
