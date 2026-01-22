import mongoose from 'mongoose'
import AppError from '../../errors/appError'
import { status as httpStatus } from 'http-status'
import { User } from '../user/user.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { facultySearchableFields } from './admin.constant'
import { TAdmin } from './admin.interface'
import { Admin } from './admin.model'

const getAllAdminFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(facultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await adminQuery.modelQuery
  const meta = await adminQuery.countTotal()

  return {
    meta,
    result,
  }
}

const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findById(id)
  return result
}

const updateSingleAdminIntoDB = async (
  id: string,
  payload: Partial<TAdmin>,
) => {
  const { name, ...restAdminData } = payload

  const modifiedUpdatedData: Record<string, unknown> = { ...restAdminData }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }

  const result = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteSingleAdminFromDB = async (id: string) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    )

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete admin.')
    }

    const userId = deletedAdmin.user

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    )
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user.')
    }

    await session.commitTransaction()
    await session.endSession()

    return deletedAdmin
  } catch (_error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete admin.')
  }
}

export const AdminServices = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateSingleAdminIntoDB,
  deleteSingleAdminFromDB,
}
