import { ADD_TASKLIST } from '../actions/taskAction'
// state
const initState = {
  taskList: [
    {
      taskName: 'MyTask',
      taskField: 0
    }
  ]
}

// reducer
export const taskReducer = (state = initState, action) => {
  switch (action.type) {
    case ADD_TASKLIST:
      return {
        ...state,
        taskList: [
          ...state.taskList,
          {
            taskName: action.payload.taskName,
            taskField: action.payload.taskField
          }
        ]
      }

    default:
      return state;
  }
}