import axios from 'axios'
import Lib from '../../utils/_lib'

const API = process.env.NEXT_PUBLIC_API

export default async function handler(req, res) {
  try {
    let params = {
      ...req.query
    }
    let result = await axios.get(`${API}/tools`, { params: params, headers: { token: req.headers.token } })
    return res.status(200).json(result.data)
  } catch (error) {
    return res.status(200).json({ ret: 500, msg: 'Internal Server Error' })
  }
}
