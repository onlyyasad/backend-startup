import { Types } from 'mongoose'

export type TPreRequisiteCourses = {
  courses: Types.ObjectId
  isDeleted: boolean
}

export type TCourse = {
  title: string
  prefix: string
  code: number
  credits: number
  isDeleted: boolean
  preRequisiteCourses: TPreRequisiteCourses[]
}
