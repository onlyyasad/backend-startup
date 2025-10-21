import { Types } from 'mongoose'
import { SemesterRegistrationStatus } from './semesterRegistration.constant'

export type TSemesterRegistrationStatus =
  (typeof SemesterRegistrationStatus)[number]

export type TSemesterRegistration = {
  academicSemester: Types.ObjectId
  status: TSemesterRegistrationStatus
  startDate: Date
  endDate: Date
  minCredit: number
  maxCredit: number
  createdAt?: Date
  updatedAt?: Date
}
