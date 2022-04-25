import React from 'react'
import Navbar from '../components/navbar'

const Login = () => {
  const [oldPassword, setOldPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [newPassword2, setNewPassword2] = React.useState('')
  const [disabled, setDisabled] = React.useState(true)
  const [ValidationChecked, setValidationChecked] = React.useState(false)
  const validateEmail = email => {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const validatePassword = password => {
    let isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/,
      isContainsNumber = /^(?=.*[0-9]).*$/

    if (password.length >= 8) {
      updateState('必須多於或等於8個字符', true)
    } else return updateState('必須多於或等於8個字符', false)

    if (password !== password.toUpperCase() && password !== password.toLowerCase()) {
      updateState('需有大小階', true)
    } else return updateState('需有大小階', false)

    if (isContainsNumber.test(password)) {
      updateState('需有數字', true)
    } else return updateState('需有數字', false)

    if (!isContainsSymbol.test(password)) {
      updateState('不可有特殊字符', true)
    } else return updateState('不可有特殊字符', false)

    return true
  }

  // TODO:
  const checkInput = () => {
    console.log('oldPassword:', oldPassword);
    console.log('newPassword:', newPassword);
    console.log('newPassword2:', newPassword2);

    setValidationChecked(true)
  }


  React.useEffect(() => {
    oldPassword !== '' && newPassword !== '' && newPassword2 !== '' ? setDisabled(false) : setDisabled(true)
  }, [oldPassword, newPassword, newPassword2])

  return (
    <div className='container'>
      <Navbar head="修改密碼" />

      <div className="mb-3">
        <label htmlFor="originPW" className="form-label">原密碼</label>
        <input type="text" onChange={(e) => setOldPassword(e.target.value)} className="form-control" id="originPW" placeholder="請輸入原有密碼" required />
      </div>

      <div className="mb-3">
        <label htmlFor="newPW" className="form-label">新密碼</label>
        <input type="text" onChange={(e) => setNewPassword(e.target.value)} className="form-control" id="newPW" placeholder="請輸入新密碼" required />
      </div>

      <div className="mb-3">
        <label htmlFor="newPW2" className="form-label">再次新密碼</label>
        <input type="text" onChange={(e) => setNewPassword2(e.target.value)} className="form-control" id="newPW2" placeholder="請再次輸入新密碼" required />
      </div>


      <button className="col-11 btn btn-primary fixed-bottom m-4 mx-auto" type="submit" onClick={checkInput} disabled={disabled}>確認修改密碼</button>

    </div>
  )
}
export default Login