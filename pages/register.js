import { useState, useEffect, useRef } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import axios from 'axios'
import Navbar from '../components/navbar'
import Circle from '../components/circle'
import Lib from '../utils/_lib'

import Logo from '../public/images/logo.png'
import success_register from '../public/images/success_register.svg'
import ellipse_error from '../public/images/ellipse_error.png'

// 檢查郵箱是否註冊
const checkEmail = async (email) => {
  try {
    let params = {
      service: 'Members.checkEmail',
      email: email
    }
    let result = await (await axios.get('/api/cms', { params: params })).data
    if (result.ret !== 200) console.error(`${result.ret}: ${result.msg}`)
    return result
  } catch (error) { console.error(error) }
}

// 註冊第一步
const firstStage = async (email, password, captcha_img) => {
  try {
    let params = {
      service: 'Members.firstStage',
      email: email,
      password: password,
      captcha_img: captcha_img
    }
    let result = await (await axios.get('/api/cms', { params: params })).data
    if (result.ret !== 200) console.error(`${result.ret}: ${result.msg}`)
    return result
  } catch (error) { console.error(error) }
}

// 註冊第二步
const secondStage = async (email, password, code) => {
  try {
    let params = {
      service: 'Members.secondStage',
      email: email,
      password: password,
      code: code
    }
    let result = await (await axios.get('/api/cms', { params: params })).data
    if (result.ret !== 200) { return console.error(`${result.ret}: ${result.msg}`) }
    return result.data
  } catch (error) { console.error(error) }
}

// 獲取郵箱驗證碼
const getCodeByEmail = async (email, captcha_img) => {
  try {
    let params = {
      service: 'Members.getCodeByEmail',
      email: email,
      captcha_img: captcha_img
    }
    let result = await (await axios.get('/api/cms', { params: params })).data
    if (result.ret !== 200) console.error(`${result.ret}: ${result.msg}`)
    return result
  } catch (error) { console.error(error) }
}

// 檢查郵箱驗證碼
const verifyEmailCode = async (email, emailVerificationCode) => {
  try {
    let params = {
      service: 'Members.verifyEmailCode',
      email: email,
      code: emailVerificationCode
    }
    let result = await (await axios.get('/api/cms', { params: params })).data
    if (result.ret !== 200) console.error(`${result.ret}: ${result.msg}`)
    return result
  } catch (error) { console.error(error) }
}

// success modal
const SuccessRegister = () => {
  const { t } = useTranslation()
  return (
    <div className="modal fade" id="SuccessRegister" tabIndex="-1" aria-labelledby="SuccessRegister" aria-hidden="true">
      <div className='modal-dialog modal-fullscreen'>
        <div className='modal-content' style={{ background: '#45C794' }}>
          <Navbar head={{ name: '', link: () => Lib.pushView(12) }} />
          <div className='modal-body mx-auto d-flex flex-column justify-content-center'>
            <Image alt="開戶成功" src={success_register} width={204} height={188} />
            <h1 className='my-3 fw-bold mx-auto'>{t('開戶成功')}</h1>
          </div>
          <div className='modal-footer border-0'>
            <button className='btn btn-primary mx-auto container' onClick={() => Lib.pushView(13)}>{t('立即入金')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}


const handleSteps = (step) => {
  ['StepOne', 'StepTwo'].map(x => document.getElementById(x).style.display = 'none')
  document.getElementById(step).style.display = 'block'
}

const handleInvildState = (inputEleId, errorMsgEleId) => {
  let inputEle = document.getElementById(inputEleId),
    errorMsgEle = document.getElementById(errorMsgEleId)

  inputEle.classList.add('is-invalid')
  errorMsgEle.style.display = 'block'
}

const clearInvildState = (inputEleId, errorMsgEleId) => {
  let inputEle = document.getElementById(inputEleId),
    errorMsgEle = document.getElementById(errorMsgEleId)

  inputEle.classList.remove('is-invalid')
  errorMsgEle.style.display = 'none'
}

const togglePasswordType = (e) => {
  let iconEle = e.target,
    inputEle = iconEle.parentElement.previousElementSibling

  if (inputEle.type === 'password') {
    inputEle.type = 'text'
    iconEle.classList.replace('bi-eye-slash', 'bi-eye')
  } else {
    inputEle.type = 'password'
    iconEle.classList.replace('bi-eye', 'bi-eye-slash')
  }
}

const Register = (props) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const [passwordValidationChecked, setPasswordValidationChecked] = useState(false)
  const [passwordValidates, setPasswordValidates] = useState(
    [
      { validate: '必須多於或等於8個字符', isValid: false },
      { validate: '需有大小階', isValid: false },
      { validate: '需有數字', isValid: false },
      { validate: '不可有特殊字符', isValid: false },
    ]
  );
  const [errorMsg, setErrorMsg] = useState({
    email: '',
    verificationCode: '驗證碼錯誤',
    emailVerificationCode: '驗證碼錯誤'
  })

  const [countdown, setCountdown] = useState(60)
  const [startCountDown, setStartCountDown] = useState(false)
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(true)
  const [sendCodeBtnDisabled, setSendCodeBtnDisabled] = useState(true)
  const [emailVerificationCode, setEmailVerificationCode] = useState('')
  const [captcha, setCaptcha] = useState('')
  const captchaRef = useRef(<div />)

  // 獲取圖片驗證碼
  const getCaptcha = async () => {
    try {
      let params = {
        service: 'Members.getCaptchaImg'
      }
      let result = await (await axios.get('/api/getCaptcha', { params: params })).data
      if (result.ret !== 200) return console.error(`${result.ret}: ${result.msg}`)
      setCaptcha(result.data)
      captchaRef.current.innerHTML = result.img
    } catch (error) { console.error(error) }
  }

  const Countdown = () => {
    return (
      <span>({countdown}s)</span>
    )
  }

  const onSubmitStepTwo = async () => {
    let verifyEmailCodeResult = await verifyEmailCode(email, emailVerificationCode)
    if (verifyEmailCodeResult.data !== 'succeed') {
      setErrorMsg(prevState => ({ ...prevState, email: '客戶中心接口錯誤代碼' + verifyEmailCodeResult.ret }))
      handleInvildState('emailVerificationCode', 'errorMsg-emailVerificationCode')
      return setSubmitBtnDisabled(true)
    }

    let isStepTwoSuccess = await secondStage(email, password, emailVerificationCode)
    if (isStepTwoSuccess !== undefined) return Lib.showModal('SuccessRegister')
  }

  // Send email verification code
  const sendEmailVerificationCode = async () => {
    setStartCountDown(true)
    let getCodeByEmailResult = await getCodeByEmail(email, captcha)
    if (getCodeByEmailResult.ret !== 200) {
      setErrorMsg(prevState => ({ ...prevState, email: '客戶中心接口錯誤代碼' + getCodeByEmailResult.ret }))
      handleInvildState('emailVerificationCode', 'errorMsg-emailVerificationCode')
      return setSubmitBtnDisabled(true)
    }
  }

  const onSubmitStepOne = async (e) => {
    setNextBtnDisabled(true)

    // 驗證碼若不正確
    if (verificationCode !== captcha) {
      return handleInvildState('verificationCode', 'errorMsg-verificationCode')
    }

    // 檢查郵箱是否註冊
    let checkEmailResult = await checkEmail(email)
    // 若郵箱格式錯誤
    if (checkEmailResult.ret !== 200) {
      setErrorMsg(prevState => ({ ...prevState, email: '客戶中心接口錯誤代碼' + checkEmailResult.ret }))
      return handleInvildState('email', 'errorMsg-email')
    }
    // 若郵箱已註冊
    if (checkEmailResult.registerStatus) {
      setErrorMsg(prevState => ({ ...prevState, email: '電郵已註冊' }))
      return handleInvildState('email', 'errorMsg-email')
    }

    // Go step two
    let isStepOneSuccess = await firstStage(email, password, captcha)
    if (isStepOneSuccess.data === 'succeed') {
      handleSteps('StepTwo')
    } else {
      setErrorMsg(prevState => ({ ...prevState, email: '客戶中心接口錯誤代碼' + isStepOneSuccess.ret }))
      return handleInvildState('email', 'errorMsg-email')
    }
  }

  const onChangeEmail = async (e) => {
    setEmail(e.target.value)
    clearInvildState('email', 'errorMsg-email')
  }
  const onChangeVerificationCode = (e) => {
    setVerificationCode(e.target.value)
  }
  const onFocusVerificationCode = (e) => {
    if (e.target.classList.contains('is-invalid')) {
      if (e.target === document.activeElement) e.target.value = ''
      clearInvildState('verificationCode', 'errorMsg-verificationCode')
      getCaptcha()
    }
  }
  const onChangeEmailVerificationCode = (e) => {
    setEmailVerificationCode(e.target.value)
    clearInvildState('emailVerificationCode', 'errorMsg-emailVerificationCode')
    if (e.target.value !== '') {
      setSubmitBtnDisabled(false)
    } else setSubmitBtnDisabled(true)
  }

  useEffect(() => {
    if (password !== '') {
      setPasswordValidationChecked(true)
      setPasswordValidates(Lib.validatePassword(password))
    }
    // check all input value qualified
    if (email !== '' && Lib.validatePassword(password).every(i => i.isValid === true) && verificationCode.length === 4) {
      setNextBtnDisabled(false)
    } else setNextBtnDisabled(true)
  }, [password, email, verificationCode])

  useEffect(() => {
    let countdownTimeout;
    if (startCountDown) {
      setSendCodeBtnDisabled(true)
      if (countdown > 0) {
        countdownTimeout = setTimeout(() => setCountdown(i => i - 1), 1000);
      } else {
        clearTimeout(countdownTimeout)
        setStartCountDown(false)
        setSendCodeBtnDisabled(false)
        setCountdown(60)
      }
    }
    return () => clearTimeout(countdownTimeout)
  }, [countdown, startCountDown]);

  useEffect(() => {
    getCaptcha()
    handleSteps('StepOne')
  }, [props])

  return (
    <div className='bg-blue text-white' style={{ height: '100vh' }}>
      <Navbar head={{ name: '註冊', link: () => Lib.pushView(11) }} />
      <div className='container'>
        <section id="StepOne">
          <div className='img-center my-4'>
            <Image src={Logo} width={222} height={40} alt='Most Finance' />
          </div>

          {/* 電郵地址 */}
          <div className="mb-3">
            <label htmlFor="email fs-4" className="form-label fw-bold">{t('電郵地址')}</label>
            <input type="email" onChange={onChangeEmail} className="form-control" id="email" placeholder={t('請輸入電郵地址')} aria-describedby="errorMsg-email" required />
            <div id="errorMsg-email" className="invalid-feedback">{t(errorMsg.email)}</div>
          </div>

          {/* 密碼 */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">{t('密碼')}</label>
            <div className="input-group">
              <input style={{ borderRight: 0 }} type="password" onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" placeholder={t('請輸入密碼')} required />
              <button style={{ borderLeft: 0 }} className="input-group-text text-secondary" onClick={togglePasswordType}>
                <i className="bi bi-eye-slash"></i>
              </button>
            </div>
          </div>
          <ul className='list-unstyled list-group mb-3'>
            {passwordValidates.map((x, i) =>
              <li key={i} className='d-flex align-items-center'>
                {passwordValidationChecked
                  ? x.isValid
                    ? <Circle color="#FFD464" />
                    : <Image src={ellipse_error} alt='Error' width={15} height={15} />
                  : <Circle />}
                <span className='ms-2'>{t(x.validate)}</span>
              </li>
            )}
          </ul>

          {/* 驗證碼 */}
          <div className="mb-3">
            <label htmlFor="verificationCode fs-4" className="form-label fw-bold">{t("驗證碼")}</label>
            <div className="d-flex align-items-center">
              <input type="text" onChange={onChangeVerificationCode} onFocus={onFocusVerificationCode} className="form-control" id="verificationCode" placeholder={t('驗證碼')} aria-describedby="errorMsg-verificationCode" required />
              <div className='ms-3' onClick={getCaptcha} ref={captchaRef}></div>
            </div>
            <div id="errorMsg-verificationCode" className="invalid-feedback">{t(errorMsg.verificationCode)}</div>
          </div>

          <button className="col-11 btn btn-primary fixed-bottom m-4 mx-auto" onClick={onSubmitStepOne} type="submit" disabled={nextBtnDisabled}>{t('下一步')}</button>
        </section>
        <section id="StepTwo">
          <label htmlFor="email fs-4" className="form-label fw-bold">{t('電郵驗證')}</label>
          <div className="row mx-1" >
            <style jsx>{`
            button {
              font-size: 12px !important;
            }
            button:disabled{
              border:0;
              color:#BEC6D2 !important;
              background:#F0F0F0;
            }
           `}</style>
            <input id="emailVerificationCode" className="col form-control" type="text" onChange={onChangeEmailVerificationCode} placeholder={t('驗證碼')} required />
            <button className='col-5 ms-2 px-1 btn btn-primary' onClick={sendEmailVerificationCode} disabled={sendCodeBtnDisabled}>{t('再發送驗證碼')}{startCountDown ? <Countdown /> : ''}</button>
          </div>
          <div id="errorMsg-emailVerificationCode" className="invalid-feedback">{t(errorMsg.emailVerificationCode)}</div>

          <div className='col-11 d-flex justify-content-evenly fixed-bottom m-4 mx-auto'>
            <button className='col-6 mx-2 btn btn-primary' onClick={() => handleSteps('StepOne')}>{t('上一步')}</button>
            <button className='col-6 mx-2 btn btn-primary' onClick={onSubmitStepTwo} disabled={submitBtnDisabled}>{t('提交')}</button>
          </div>
        </section>
      </div>
      <SuccessRegister />
    </div>
  )
}

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ... await serverSideTranslations(locale),
    },
  }
}

export default Register