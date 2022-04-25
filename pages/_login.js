import React from 'react'
import Navbar from '../components/navbar'
import Link from 'next/link'
import Circle from '../components/circle'

const Login = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [disabled, setDisabled] = React.useState(true)
  const [ValidationChecked, setValidationChecked] = React.useState(false)
  const [rememberPassword, setRememberPassword] = React.useState(false);


  const updateState = (requirement, isValid) => {
    let newVal = [...requirements];
    newVal.filter(x => x.requirement === requirement).map(x => x.isValid = isValid)
    setRequirements(newVal)
  }
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
  const checkLogin = () => {
    console.log('password:', password);
    console.log('email:', email);

    setValidationChecked(true)
  }

  const togglePasswordType = (e) => {
    let ele = e.target;
    if (ele.previousElementSibling.type === 'password') {
      ele.previousElementSibling.type = 'text'
      ele.classList.remove('bi-eye-slash')
      ele.classList.add('bi-eye')
    } else {
      ele.previousElementSibling.type = 'password'
      ele.classList.remove('bi-eye')
      ele.classList.add('bi-eye-slash')
    }
  }

  React.useEffect(() => {
    console.log('password:', password);
    console.log('email:', email);
    password !== '' && email !== '' ? setDisabled(false) : setDisabled(true)
  }, [password, email])

  return (
    <div className='container'>
      <Navbar />
      <h1 className='m-5 text-center'>LOGO</h1>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">電郵地址</label>
        <input type="email" onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" placeholder="請輸入電郵地址" required />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">密碼</label>
        <div className="input-group">
          <input type="password" onChange={(e) => setPassword(e.target.value)} className="form-control border-0" id="password" placeholder="請輸入密碼" required />
          <i className="input-group-text bg-white border-0 bi bi-eye-slash" onClick={togglePasswordType}></i>
        </div>
      </div>
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <div className='d-flex align-items-center' onClick={() => rememberPassword ? setRememberPassword(false) : setRememberPassword(true)}>
          <Circle color={rememberPassword ? '#FFD464' : 'transparent'} />
          <span className='ms-2'>記住密碼</span>
        </div>
        <Link href='/reset'><a>忘記密碼</a></Link>
      </div>

      <button className="col-11 btn btn-primary fixed-bottom m-4 mx-auto" type="submit" onClick={checkLogin} disabled={disabled}>下一步</button>

    </div>
  )
}
export default Login