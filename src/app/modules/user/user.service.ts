import mongoose from 'mongoose'
import config from '../../config'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { TStudent } from '../student/student.interface'
import { Student } from '../student/student.model'
import { TUser } from './user.interface'
import { User } from './user.model'
import { generateStudentId } from './user.utils'
import AppError from '../../errors/appError'
import { status as httpStatus } from 'http-status'

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user object
  const userData: Partial<TUser> = {}

  userData.password = password || (config.default_password as string)

  //set student role
  userData.role = 'student'

  //set manually generated id

  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  )

  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    userData.id = await generateStudentId(admissionSemester)

    //create a user (---- Transaction 1 -----)
    const newUser = await User.create([userData], { session })

    // create a student

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user.')
    }
    //set id, _id as user
    payload.id = newUser[0].id //embedding id
    payload.user = newUser[0]._id //reference id

    //create a student (---- Transaction 2 -----)

    const newStudent = await Student.create([payload], { session })

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student.')
    }

    await session.commitTransaction()
    await session.endSession()

    return newStudent[0]
  } catch (_error) {
    await session.abortTransaction()
    await session.endSession()
  }
}

export const UserServices = {
  createStudentIntoDB,
}
