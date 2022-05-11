import { ADD_INFO } from "../type"

export const addInfo = (info) => ({
  type: ADD_INFO,
  payload: { ...info }
})