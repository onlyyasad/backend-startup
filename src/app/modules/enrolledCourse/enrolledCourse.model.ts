import { GRADE } from './enrolledCourse.constant'
import mongoose, { Schema } from 'mongoose'
import { TEnrolledCourse } from './enrolledCourse.interface'

const courseMarksSchema = new Schema({
  classTest1: { type: Number, default: 0 },
  midTerm: { type: Number, default: 0 },
  classTest2: { type: Number, default: 0 },
  finalTerm: { type: Number, default: 0 },
})
const enrolledCourseSchema = new Schema<TEnrolledCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: 'SemesterRegistration',
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: true,
    },
    offeredCourse: {
      type: Schema.Types.ObjectId,
      ref: 'OfferedCourse',
      required: true,
    },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty', required: true },
    isEnrolled: { type: Boolean, default: false },
    courseMarks: { type: courseMarksSchema, default: {} },
    grade: { type: String, enum: GRADE, default: 'N/A' },
    gradePoints: { type: Number, min: 0, max: 4, default: 0 },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const EnrolledCourse = mongoose.model<TEnrolledCourse>(
  'EnrolledCourse',
  enrolledCourseSchema,
)
