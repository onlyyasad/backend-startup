import { TSchedule } from './offeredCourse.interface'

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const assigned of assignedSchedules) {
    const existingStartTime = new Date(`1970-01-01T${assigned.startTime}:00Z`)
    const existingEndTime = new Date(`1970-01-01T${assigned.endTime}:00Z`)
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}:00Z`)
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}:00Z`)

    const isOverlap =
      newStartTime < existingEndTime && newEndTime > existingStartTime

    if (isOverlap) {
      return true
    }
  }
  return false
}
