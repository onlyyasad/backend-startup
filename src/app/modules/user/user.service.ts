import mongoose from 'mongoose'
import config from '../../config'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { TStudent } from '../student/student.interface'
import { Student } from '../student/student.model'
import { IFile, TUser } from './user.interface'
import { User } from './user.model'
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils'
import AppError from '../../errors/appError'
import { status as httpStatus } from 'http-status'
import { TFaculty } from '../faculty/faculty.interface'
import { Faculty } from '../faculty/faculty.model'
import { Admin } from '../admin/admin.model'
import { USER_ROLE } from './user.constant'
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary'

const getMeFromDB = async (id: string, role: string) => {
  let result = null
  if (role === USER_ROLE.student) {
    result = await Student.findOne({ id }).populate('user')
  }
  if (role === USER_ROLE.faculty) {
    result = await Faculty.findOne({ id }).populate('user')
  }
  if (role === USER_ROLE.admin) {
    result = await Admin.findOne({ id }).populate('user')
  }
  return result
}

const createStudentIntoDB = async (
  file: IFile,
  password: string,
  payload: TStudent,
) => {
  //create a user object
  const userData: Partial<TUser> = {}

  userData.password = password || (config.default_password as string)

  //set student role
  userData.role = 'student'
  userData.email = payload.email

  //set manually generated id

  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  )

  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    userData.id = await generateStudentId(admissionSemester)

    const imageName = `${userData.id}-${payload?.name?.firstName}-${Date.now()}`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imageData: any = await sendImageToCloudinary(
      imageName,
      file?.path as string,
    )

    //create a user (---- Transaction 1 -----)
    const newUser = await User.create([userData], { session })

    // create a student

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user.')
    }
    //set id, _id as user
    payload.id = newUser[0].id //embedding id
    payload.user = newUser[0]._id //reference id
    payload.profileImg = imageData?.secure_url

    //create a student (---- Transaction 2 -----)

    const newStudent = await Student.create([payload], { session })

    if (!newStudent.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create student2222.',
      )
    }

    await session.commitTransaction()
    await session.endSession()

    return newStudent[0]
  } catch (_error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student.')
  }
}

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  //create a user object
  const userData: Partial<TUser> = {}

  userData.password = password || (config.default_password as string)

  //set faculty role
  userData.role = 'faculty'
  userData.email = payload.email

  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    userData.id = await generateFacultyId()

    //create a user (---- Transaction 1 -----)
    const newUser = await User.create([userData], { session })

    // create a faculty

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user.')
    }
    //set id, _id as user
    payload.id = newUser[0].id //embedding id
    payload.user = newUser[0]._id //reference id

    //create a faculty (---- Transaction 2 -----)

    const newFaculty = await Faculty.create([payload], { session })

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty.')
    }

    await session.commitTransaction()
    await session.endSession()

    return newFaculty[0]
  } catch (_error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty.')
  }
}

const createAdminIntoDB = async (password: string, payload: TFaculty) => {
  //create a user object
  const userData: Partial<TUser> = {}

  userData.password = password || (config.default_password as string)

  //set admin role
  userData.role = 'admin'
  userData.email = payload.email

  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    userData.id = await generateAdminId()

    //create a user (---- Transaction 1 -----)
    const newUser = await User.create([userData], { session })

    // create a admin

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user.')
    }
    //set id, _id as user
    payload.id = newUser[0].id //embedding id
    payload.user = newUser[0]._id //reference id

    //create a admin (---- Transaction 2 -----)

    const newAdmin = await Admin.create([payload], { session })

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin.')
    }

    await session.commitTransaction()
    await session.endSession()

    return newAdmin[0]
  } catch (_error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin.')
  }
}

const changeStatusInDB = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(
    id,
    { status: payload.status },
    { new: true },
  )
  return result
}

export const UserServices = {
  getMeFromDB,
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  changeStatusInDB,
}
