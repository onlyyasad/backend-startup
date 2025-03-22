import { Student } from './student.model'

const getAllStudentFromDB = async () => {
  const result = await Student.find()
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    })
    .populate('admissionSemester')
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

const deleteSingleStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true })
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    })
    .populate('admissionSemester')
  return result
}

export const StudentServices = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
}
