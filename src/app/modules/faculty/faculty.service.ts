import mongoose from 'mongoose'
import AppError from '../../errors/appError'
import { status as httpStatus } from 'http-status'
import { User } from '../user/user.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { Faculty } from './faculty.model'
import { facultySearchableFields } from './faculty.constant'
import { TFaculty } from './faculty.interface'

const getAllFacultyFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find()
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      })
      .populate('academicFaculty'),
    query,
  )
    .search(facultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await facultyQuery.modelQuery

  return result
}

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findOne({ id })
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    })
    .populate('academicFaculty')
  return result
}

const updateSingleFacultyIntoDB = async (
  id: string,
  payload: Partial<TFaculty>,
) => {
  const { name, ...restFacultyData } = payload

  const modifiedUpdatedData: Record<string, unknown> = { ...restFacultyData }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }

  const result = await Faculty.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteSingleFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    const deletedFaculty = await Faculty.findOneAndUpdate(
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
      .populate('academicFaculty')

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty.')
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

    return deletedFaculty
  } catch (_error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty.')
  }
}

export const FacultyServices = {
  getAllFacultyFromDB,
  getSingleFacultyFromDB,
  updateSingleFacultyIntoDB,
  deleteSingleFacultyFromDB,
}
