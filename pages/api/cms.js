import axios from 'axios'
import Lib from '../../utils/_lib'

const API = process.env.NEXT_PUBLIC_API

export default async function handler(req, res) {
  try {
    let params = {
      ...req.query,
      idfa: Lib.getInfo().idfa,
      timestamp: parseInt(new Date().getTime() / 1000)
    }
    let result = await axios.get(`${API}/cms`, { params: { ...params, sign: Lib.getSign(params) }, headers: { token: Lib.getInfo().token } })
    res.status(200).json(result.data)
  } catch (error) {
    res.status(500).json(error)
  }
}
