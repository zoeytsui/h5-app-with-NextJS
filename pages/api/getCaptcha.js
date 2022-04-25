import axios from 'axios'
import svgCaptcha from 'svg-captcha'
import Lib from '../../utils/_lib'

const API = process.env.NEXT_PUBLIC_API

export default async function handler(req, res) {
  try {
    let params = {
      ...req.query,
      idfa: Lib.getInfo().idfa,
      timestamp: parseInt(new Date().getTime() / 1000)
    }
    let result = await axios.get(`${API}/cms`, { params: { ...params, sign: Lib.getSign(params) } })
    let img = svgCaptcha(result.data.data, {
      noise: Math.floor(Math.random() * 5),
      background: '#fff',
      width: 100,
      height: 35
    })
    res.status(200).json({ ...result.data, img: img })
  } catch (error) {
    res.status(500).json(error)
  }
}
