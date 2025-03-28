import AppError from '../../errors/appError'
import { academicSemesterNameCodeMapper } from './academicSemester.constant'
import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemester } from './academicSemester.model'
import { status as httpStatus } from 'http-status'

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Invalid semester code')
  }
  const result = await AcademicSemester.create(payload)
  return result
}

const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemester.find()
  return result
}

const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findById(id)
  return result
}

const updateSingleAcademicSemesterFromDB = async (
  id: string,
  payload: TAcademicSemester,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    new AppError(httpStatus.NOT_ACCEPTABLE, 'Invalid semester code')
  }
  const result = await AcademicSemester.findByIdAndUpdate(id, payload, {
    new: true,
  })
  return result
}

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateSingleAcademicSemesterFromDB,
}
