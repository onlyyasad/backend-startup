import { Schema, model } from 'mongoose'
import validator from 'validator'
import { TFaculty, TFacultyModel, TUserName } from './faculty.interface'
import { BloodGroup, Gender } from './faculty.constant'

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    minlength: [3, 'First Name must be at least 3 characters long.'],
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

const facultySchema = new Schema<TFaculty, TFacultyModel>(
  {
    id: {
      type: String,
      unique: true,
      required: [true, 'Faculty ID is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required.'],
      unique: true,
      ref: 'User',
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
    },
    name: {
      type: userNameSchema,
      required: [true, 'Faculty name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message:
          "{VALUE} is not supported, use 'male', 'female' or 'other' instead",
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: {
      type: Date,
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
      unique: true,
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
        values: BloodGroup,
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    profileImg: {
      type: String,
      default: '',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic department is required'],
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic faculty is required'],
      ref: 'AcademicFaculty',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
  },
)

facultySchema.virtual('fullName').get(function () {
  return (
    this?.name?.firstName +
    ' ' +
    this?.name?.middleName +
    ' ' +
    this?.name?.lastName
  )
})

facultySchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Faculty.findOne({ id })
  return existingUser
}

facultySchema.pre('findOne', async function (next) {
  this.findOne({ isDeleted: { $ne: true } })
  next()
})

facultySchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

facultySchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

export const Faculty = model<TFaculty, TFacultyModel>('Faculty', facultySchema)
