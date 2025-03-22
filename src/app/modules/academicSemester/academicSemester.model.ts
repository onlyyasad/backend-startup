import { model, Schema } from 'mongoose'
import { status as httpStatus } from 'http-status'
import { TAcademicSemester } from './academicSemester.interface'
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constant'
import AppError from '../../errors/appError'

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: AcademicSemesterName,
      required: true,
    },
    code: {
      type: String,
      enum: AcademicSemesterCode,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      enum: Months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Months,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  })
  if (isSemesterExists) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Semester is already exists')
  }
  next()
})

academicSemesterSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery()
  const isSemesterExists = await AcademicSemester.findOne({
    _id: query._id,
  })

  if (!isSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This semester does not exists!')
  }

  next()
})

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
)
