import { useState, useEffect, useRef, createRef } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next'
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/router';
import Image from 'next/image'
import axios from 'axios'
import Navbar from '../components/navbar'
import Circle from '../components/circle'
import SuccessModal from '../components/successModal';
import Lib from '../utils/_lib'
import success_register from '../public/images/success_register.svg'
import ellipse_error from '../public/images/ellipse_error.png'

// TODO: Remove nav left button
const Reset = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const key = new URLSearchParams(router.asPath.replace('/reset', '')).get('key')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [errorFeedback, setErrorFeedback] = useState('')
  const passwordRef = createRef()
  const password2Ref = createRef()
  const [disabled, setDisabled] = useState(true)
  const [passwordValidationChecked, setPasswordValidationChecked] = useState(false)
  const [passwordValidates, setPasswordValidates] = useState(
    [
      { validate: '必須多於或等於8個字符', isValid: false },
      { validate: '需有大小階', isValid: false },
      { validate: '需有數字', isValid: false },
      { validate: '不可有特殊字符', isValid: false },
    ]
  );
  const dispatch = useDispatch()
  const IDFA = useSelector(state => state.info.idfa)

  const updateState = (requirement, isValid) => {
    let newVal = [...requirements];
    newVal.filter(x => x.requirement === requirement).map(x => x.isValid = isValid)
    setRequirements(newVal)
  }

  const submitInput = async (e) => {
    e.preventDefault()
    if (password !== password2) return setErrorFeedback('密碼不相同')
    let result = await Lib.fetchData_cms({
      service: 'Members.validateResetPwd',
      key: key,
      password: password,
      idfa: IDFA
    })
    if (result.ret !== 200) return setErrorFeedback('客戶中心接口錯誤代碼' + result.ret)
    if (result.data === 'succeed') return Lib.showModal('SuccessModal')
  }

  const togglePasswordTypeCombined = () => {
    if (passwordRef.current.type === 'password') {
      passwordRef.current.type = 'text'
      password2Ref.current.type = 'text'
      passwordRef.current.nextElementSibling.children[0].classList.replace('bi-eye-slash', 'bi-eye')
      password2Ref.current.nextElementSibling.children[0].classList.replace('bi-eye-slash', 'bi-eye')
    } else {
      passwordRef.current.type = 'password'
      password2Ref.current.type = 'password'
      passwordRef.current.nextElementSibling.children[0].classList.replace('bi-eye', 'bi-eye-slash')
      password2Ref.current.nextElementSibling.children[0].classList.replace('bi-eye', 'bi-eye-slash')
    }
  }

  useEffect(() => {
    if (password !== '') {
      setPasswordValidationChecked(true)
      setPasswordValidates(Lib.validatePassword(password))
    }
    Lib.validatePassword(password).every(i => i.isValid === true) && password2 !== '' ? setDisabled(false) : setDisabled(true)
  }, [password, password2])

  useEffect(() => {
    dispatch({ type: 'ADD_INFO', payload: Lib.getInfo() })
  }, [])

  return (
    <div className='bg-blue text-white' style={{ height: '100vh' }}>
      <Navbar head={{ name: '重置密碼', link: '/' }} />

      <div className='container'>
        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-bold">{t('新密碼')}</label>
          <div className="input-group">
            <input style={{ borderRight: 0 }} ref={passwordRef} type="password" onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder={t('請輸入密碼')} required />
            <button style={{ borderLeft: 0 }} className="input-group-text text-secondary" onClick={togglePasswordTypeCombined}>
              <i className="bi bi-eye-slash"></i>
            </button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-bold">{t('再次輸入新密碼')}</label>
          <div className="input-group">
            <input style={{ borderRight: 0 }} ref={password2Ref} type="password" onChange={(e) => setPassword2(e.target.value)} className="form-control" placeholder={t('請輸入密碼')} required />
            <button style={{ borderLeft: 0 }} className="input-group-text text-secondary" onClick={togglePasswordTypeCombined}>
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

        <p className='text-center text-danger fs-5 mt-4' id='error-feedback'>{t(errorFeedback)}</p>

        <button className="col-11 btn btn-primary fixed-bottom m-4 mx-auto" type="submit" onClick={submitInput} disabled={disabled}>{t('確認')}</button>
      </div>
      <SuccessModal text='重置密碼成功' />
    </div >
  )
}
export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ... await serverSideTranslations(locale),
    },
  }
}
export default Reset