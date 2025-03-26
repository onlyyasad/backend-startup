import mongoose from 'mongoose'
import { Student } from './student.model'
import AppError from '../../errors/appError'
import { status as httpStatus } from 'http-status'
import { User } from '../user/user.model'
import { TStudent } from './student.interface'
import QueryBuilder from '../../builder/QueryBuilder'
import { studentSearchableFields } from './student.constant'

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query }
  // const studentSearchableFields = ['email', 'name.firstName', 'presentAddress']
  // let searchTerm = ''
  // if (query.searchTerm) {
  //   searchTerm = query.searchTerm as string
  // }

  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // })

  // //filtering
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields']
  // excludeFields.forEach((el) => delete queryObj[el])

  // console.log({ query }, { queryObj })
  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   })
  //   .populate('admissionSemester')

  // let sort = '-createdAt'
  // if (query.sort) {
  //   sort = query.sort as string
  // }

  // const sortQuery = filterQuery.sort(sort)

  // let page = 1
  // let limit = 1
  // let skip = 0

  // if (query.limit) {
  //   limit = Number(query.limit)
  // }

  // if (query.page) {
  //   page = Number(query.page)
  //   skip = (page - 1) * limit
  // }

  // const paginateQuery = sortQuery.skip(skip)

  // const limitQuery = paginateQuery.limit(limit)

  //field limiting
  // let fields = '-__v'

  // if (query.fields) {
  //   fields = (query.fields as string).split(',').join(' ')
  // }

  // const fieldQuery = await limitQuery.select(fields)

  const studentQuery = new QueryBuilder(Student.find(), query)
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await studentQuery.modelQuery

  return result
}

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    })
    .populate('admissionSemester')
  return result
}

const updateSingleStudentIntoDB = async (
  id: string,
  payload: Partial<TStudent>,
) => {
  const { name, guardian, localGuardian, ...restStudentData } = payload

  const modifiedUpdatedData: Record<string, unknown> = { ...restStudentData }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteSingleStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      })
      .populate('admissionSemester')

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student.')
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user.')
    }

    await session.commitTransaction()
    await session.endSession()

    return deletedStudent
  } catch (_error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student.')
  }
}

export const StudentServices = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateSingleStudentIntoDB,
  deleteSingleStudentFromDB,
}
