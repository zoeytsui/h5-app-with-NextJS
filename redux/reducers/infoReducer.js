import { ADD_INFO } from "../type"

// state
const initState = {
  // account: "61000027",
  // accountType: 1,
  // channel: "google-play&utm_medium=organic",
  // firstLogin: false,
  // hasReal: true,
  // acountMember_type: "V",
  // idfa: "a531a5134306dff9",
  // token: "aac8f6b9f34fb557bd4ee03698a4fa73"
  idfa: "",
  token: ""
}

// reducer
export const infoReducer = (state = initState, action) => {
  switch (action.type) {
    case ADD_INFO:
      return {
        ...state,
        idfa: action.payload.idfa,
        token: action.payload.token
      }

    default:
      return state;
  }
}