import QueryBuilder from '../../builder/QueryBuilder'
import { TAcademicDepartment } from './academicDepartment.interface'
import { AcademicDepartment } from './academicDepartment.model'

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  //create an academic department

  const newAcademicDepartment = await AcademicDepartment.create(payload)

  return newAcademicDepartment
}

const getAllAcademicDepartmentsFromDB = async (
  query: Record<string, unknown>,
) => {
  const academicDepartmentsQuery = new QueryBuilder(
    AcademicDepartment.find().populate('academicFaculty'),
    query,
  )

  const result = await academicDepartmentsQuery.modelQuery
  const meta = await academicDepartmentsQuery.countTotal()

  return {
    meta,
    result,
  }
}

const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const result =
    await AcademicDepartment.findById(id).populate('academicFaculty')
  return result
}

const updateSingleAcademicDepartmentFromDB = async (
  id: string,
  payload: TAcademicDepartment,
) => {
  const result = await AcademicDepartment.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('academicFaculty')
  return result
}

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentsFromDB,
  getSingleAcademicDepartmentFromDB,
  updateSingleAcademicDepartmentFromDB,
}
