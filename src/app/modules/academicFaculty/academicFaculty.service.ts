import QueryBuilder from '../../builder/QueryBuilder'
import { TAcademicFaculty } from './academicFaculty.interface'
import { AcademicFaculty } from './academicFaculty.model'

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  //create an academic faculty
  const newAcademicFaculty = await AcademicFaculty.create(payload)

  return newAcademicFaculty
}

const getAllAcademicFacultiesFromDB = async (
  query: Record<string, unknown>,
) => {
  const academicFacultyQuery = new QueryBuilder(AcademicFaculty.find(), query)
  const result = await academicFacultyQuery.modelQuery
  const meta = await academicFacultyQuery.countTotal()

  return {
    meta,
    result,
  }
}

const getSingleAcademicFacultyFromDB = async (id: string) => {
  const result = await AcademicFaculty.findById(id)
  return result
}

const updateSingleAcademicFacultyFromDB = async (
  id: string,
  payload: TAcademicFaculty,
) => {
  const result = await AcademicFaculty.findByIdAndUpdate(id, payload, {
    new: true,
  })
  return result
}

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultiesFromDB,
  getSingleAcademicFacultyFromDB,
  updateSingleAcademicFacultyFromDB,
}
