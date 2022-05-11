export const ADD_TASKLIST = 'ADD_TASKLIST'

export const addTasklist = (taskList) => ({
  type: ADD_TASKLIST,
  payload: { ...taskList }
})