import { HYDRATE } from "next-redux-wrapper";

// state
const initState = {
  taskList: [
    {
      taskName: null,
      taskField: null
    }
  ]
}

// reducer
export const registrationReducer = (state = initState, action) => {
  switch (action.type) {
    case HYDRATE: {
      return {
        ...state
      }
    }
    case 'ADD_TASKLIST':
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