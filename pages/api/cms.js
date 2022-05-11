import axios from 'axios'
import Lib from '../../utils/_lib'

const API = process.env.NEXT_PUBLIC_API

export default async function handler(req, res) {
  try {
    let params = {
      ...req.query,
      timestamp: parseInt(new Date().getTime() / 1000)
    }, result
    if (req.headers.token) {
      result = await axios.get(`${API}/cms`, { params: { ...params, sign: Lib.getSign(params) }, headers: { token: req.headers.token } })
    } else {
      result = await axios.get(`${API}/cms`, { params: { ...params, sign: Lib.getSign(params) } })
    }
    return res.status(200).json(result.data)
  } catch (error) {
    return res.status(200).json({ ret: 500, msg: 'Internal Server Error' })
  }
}
