import { TAcademicDepartment } from './academicDepartment.interface'
import { AcademicDepartment } from './academicDepartment.model'

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  //create an academic department

  const newAcademicDepartment = await AcademicDepartment.create(payload)

  return newAcademicDepartment
}

const getAllAcademicDepartmentsFromDB = async () => {
  const result = await AcademicDepartment.find().populate('academicFaculty')
  return result
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
