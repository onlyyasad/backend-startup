import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/appError'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { SemesterRegistrationStatus } from './semesterRegistration.constant'
import { TSemesterRegistration } from './semesterRegistration.interface'
import { SemesterRegistration } from './semesterRegistration.model'
import { status as httpStatus } from 'http-status'

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
  const result = semesterRegistrationQuery.modelQuery
  return result
}

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id)
  return result
}

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemesterId = payload.academicSemester
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemesterId)

  if (!isAcademicSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Semester not found')
  }

  const isAlreadyUpcomingOrOngoingRegisteredSemesterExists =
    await SemesterRegistration.findOne({
      $or: [
        { status: SemesterRegistrationStatus[0] },
        { status: SemesterRegistrationStatus[1] },
      ],
    })

  if (isAlreadyUpcomingOrOngoingRegisteredSemesterExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `An ${isAlreadyUpcomingOrOngoingRegisteredSemesterExists.status} semester registration already exists!`,
    )
  }

  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester: academicSemesterId,
  })

  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Semester Registration already exists for this academic semester',
    )
  }

  const result = await SemesterRegistration.create(payload)
  return result
}

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: TSemesterRegistration,
) => {
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload)
  return result
}

export const SemesterRegistrationService = {
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  createSemesterRegistrationIntoDB,
  updateSemesterRegistrationIntoDB,
}
