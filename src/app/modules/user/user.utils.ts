import { TAcademicSemester } from '../academicSemester/academicSemester.interface'
import { User } from './user.model'

export const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean()

  return lastStudent?.id ? lastStudent.id : undefined
}

export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean()

  return lastFaculty?.id ? lastFaculty.id : undefined
}

export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean()

  return lastAdmin?.id ? lastAdmin.id : undefined
}

export const generateStudentId = async (payload: TAcademicSemester | null) => {
  //first time 0000
  let currentId = (0).toString()

  const lastStudentId = await findLastStudentId()
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6)
  const lastStudentYear = lastStudentId?.substring(0, 4)
  const currentSemesterCode = payload?.code
  const currentYear = payload?.year

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6)
  }
  let incrementId = String(Number(currentId) + 1).padStart(4, '0')
  incrementId = `${payload?.year}${payload?.code}${incrementId}`

  return incrementId
}

export const generateFacultyId = async () => {
  //first time 0000
  let currentId = (0).toString()

  const lastFacultyId = await findLastFacultyId()

  if (lastFacultyId) {
    currentId = lastFacultyId?.substring(2)
  }
  let incrementId = String(Number(currentId) + 1).padStart(4, '0')
  incrementId = `F-${incrementId}`

  return incrementId
}

export const generateAdminId = async () => {
  //first time 0000
  let currentId = (0).toString()

  const lastAdminId = await findLastAdminId()

  if (lastAdminId) {
    currentId = lastAdminId?.substring(2)
  }
  let incrementId = String(Number(currentId) + 1).padStart(4, '0')
  incrementId = `A-${incrementId}`

  return incrementId
}
