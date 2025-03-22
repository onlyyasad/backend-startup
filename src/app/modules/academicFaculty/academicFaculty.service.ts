import { TAcademicFaculty } from './academicFaculty.interface'
import { AcademicFaculty } from './academicFaculty.model'

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  //create an academic faculty
  const newAcademicFaculty = await AcademicFaculty.create(payload)

  return newAcademicFaculty
}

const getAllAcademicFacultiesFromDB = async () => {
  const result = await AcademicFaculty.find()
  return result
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
