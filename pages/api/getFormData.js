import axios from 'axios'
import { i18n } from "next-i18next";
import Lib from '../../utils/_lib'

const API = process.env.NEXT_PUBLIC_API

export default async function handler(req, res) {
  try {
    let params = {
      service: 'deposit.callback',
      encryptedText: req.body.encryptedText,
      signedText: req.body.signedText,
      order: req.query.order,
      paySwitchSeqId: req.query.paySwitchSeqId,
      track: Lib.genTrack()
    }
    let callback = await axios.get(`${API}/tools/`, { params: params, headers: { token: Lib.getInfo().token } })
    if (callback.ret !== 200) {
      return res.redirect(307, `/${i18n.language}/deposit?pno=${callback.data.data}`)
    } else return res.redirect(307, `/${i18n.language}/deposit`)
  } catch (error) {
    res.status(500).json(error)
  }
}