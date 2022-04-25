import axios from 'axios'
export default async function handler(req, res) {
  try {
    let result = await (await axios.get('https://api.ipify.org/?format=json')).data
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error)
  }
}
