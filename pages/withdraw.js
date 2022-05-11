import { useState, useEffect, useRef, createRef } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { i18n, useTranslation } from 'next-i18next'
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/router';
import Navbar from '../components/navbar'
import SuccessModal from '../components/successModal'
import FailModal from '../components/failModal'
import Lib from '../utils/_lib';
import axios from 'axios';
import Image from 'next/image'
import { Html5Qrcode } from "html5-qrcode"
import qrcodeicon from '../public/images/qrcodeicon.png'

const Withdraw = (props) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [withdrawPermission, setWithdrawPermission] = useState(false)
  const amountRef = createRef()
  const addressRef = createRef()
  const [amount, setAmount] = useState(0)
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState(0)
  const [servicesCharge, setServicesCharge] = useState(0)
  const [actualAmount, setActualAmount] = useState(0)
  const [uploadFile, setUploadFile] = useState('')
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(true)
  const [errorFeedback, setErrorFeedback] = useState('')

  const dispatch = useDispatch()
  const TOKEN = useSelector(state => state.info.token)

  // 是否可以出金
  const withdrawpermission = async () => {
    try {
      let params = {
        service: 'withdraw.withdrawpermission',
      }
      let result = await (await axios.get('/api/tools', { params: params, headers: { token: TOKEN } })).data
      if (result.ret !== 200) console.error(`${result.ret}: ${result.msg}`)
      return result
    } catch (error) { console.error(error) }
  }

  // 手续费计算
  const getfee = async (amount) => {
    try {
      let params = {
        service: 'withdraw.getfee',
        amount: amount,
        track: Lib.genTrack()
      }
      let result = await (await axios.get('/api/tools', { params: params, headers: { token: TOKEN } })).data
      if (result.ret !== 200) console.error(`${result.ret}: ${result.msg}`)
      return result
    } catch (error) { console.error(error) }
  }

  // 可用余额
  const getaw = async () => {
    try {
      let params = {
        service: 'withdraw.getaw'
      }
      let result = await (await axios.get('/api/tools', { params: params, headers: { token: TOKEN } })).data
      if (result.ret !== 200) return console.error(`${result.ret}: ${result.msg}`)
      return result
    } catch (error) { console.error(error) }
  }

  // 出金
  const withdrawIndex = async (amount) => {
    try {
      let params = {
        service: 'withdraw.index',
        amount: amount,
        track: Lib.genTrack()
      }
      let result = await (await axios.get('/api/tools', { params: params, headers: { token: TOKEN } })).data
      if (result.ret !== 200) console.error(`${result.ret}: ${result.msg}`)
      return result
    } catch (error) { console.error(error) }
  }
  const onSubmit = async () => {
    console.log('amount', amount);
    console.log('addressRef', addressRef.current.value);
    console.log('address', address);

    let withdrawIndexResult = await withdrawIndex(amount)
    console.log(withdrawIndexResult);
    if (withdrawIndexResult.ret === 200) {
      Lib.showModal('SuccessModal')
    } else errorHandler('GTS2接口錯誤代碼' + withdrawIndexResult.msg)
  }

  const onCahngeAmount = (e) => {
    setAmount(e.target.value)
  }

  const onBlurAmount = async (e) => {
    let getfeeResult = await getfee(amount)
    if (getfeeResult.ret !== 200) return errorHandler('GTS2接口錯誤代碼' + getfeeResult.msg)
    setServicesCharge(getfeeResult.data)
  }

  const errorHandler = (text) => {
    setErrorFeedback(text)
    Lib.showModal('FailModal')
  }

  useEffect(() => {
    setActualAmount(amount - servicesCharge)

    amount > 0 && address !== '' && actualAmount > 0
      ? setSubmitBtnDisabled(false)
      : setSubmitBtnDisabled(true)
  }, [amount, address, servicesCharge, actualAmount])

  useEffect(() => {
    const html5Qrcode = new Html5Qrcode("reader");
    if (uploadFile !== '') {
      html5Qrcode.scanFile(uploadFile, false).then(text => addressRef.current.value = text)
    }
  }, [uploadFile])

  useEffect(() => {
    (async () => {
      if (TOKEN !== '') {
        // 是否可以出金
        let withdrawpermissionResult = await withdrawpermission()
        if (withdrawpermissionResult.ret !== 200) return errorHandler('GTS2接口錯誤代碼' + withdrawpermissionResult.msg)

        // 可提餘額
        let getawResult = await getaw()
        if (getawResult.ret !== 200) return errorHandler('GTS2接口錯誤代碼' + withdrawIndexResult.msg)
        setBalance(getawResult.data.GTS2)
      }
    })()
  }, [TOKEN])

  useEffect(() => {
    dispatch({ type: 'ADD_INFO', payload: Lib.getInfo() })
  }, [])
  return (
    <>
      <Navbar
        head={{ name: '取款', link: () => Lib.pushView(11) }}
        detail={() => router.push({
          pathname: '/detail',
          query: { page: 'withdraw' },
          locale: router.locale
        })}
        className="bg-blue"
      />
      <div className='container mt-2'>
        <style jsx>{`
        .tabContent{
          border-radius: 20px;
          font-size: 16px;
        }
        .hstack div:first-child{
            min-width: 80px;
        }
        hr {
          height: 0.5px;
        }
        input, input:focus {
          background-color: #F5F7FB;
          text-align: center;
          font-size: 16px;
          color: #293878;
          border: 0;
        }
        
        #error-feedback{
          font-size: 16px;
          color: #F2608C;
        }
        .input-group-text{
          background: #f5f7fb;
        }
      `}</style>
        <div className='tabContent bg-white shadow-sm p-3'>
          {/* 貨幣鏈 */}
          <div className="hstack">
            <div>{t('貨幣鏈')}</div>
            <div className="vr mx-2"></div>
            <div className="ms-auto fw-bold">{'USDT-erc20'}</div>
          </div>
          <hr />
          {/* 取款地址 */}
          <div className="hstack">
            <div>{t('取款地址')}</div>
            <div className="vr mx-2"></div>
            <div className="input-group">
              <input type="text" className="form-control" ref={addressRef} onChange={(e) => setAddress(e.target.value)} placeholder={t('請輸入取款地址')} aria-label={t('請輸入取款地址')} />
              <div className="input-group-text">
                <label htmlFor="qrcode-input">
                  <Image src={qrcodeicon} width={26} height={26} alt={t('取款地址')} />
                </label>
                <input onChange={(e) => setUploadFile(e.target.files[0])} type="file" accept="image/*" id="qrcode-input" style={{ display: 'none' }} capture />
              </div>
            </div>
          </div>
          <hr />
          {/* 金額 */}
          <div className="hstack">
            <div>{t('金額')}</div>
            <div className="vr mx-2"></div>
            <div className='input-group'>
              <input className="ms-auto form-control" ref={amountRef} onBlur={onBlurAmount} onKeyDown={Lib.preventNumberSymbol} onInput={Lib.input8Decimal} onChange={onCahngeAmount} placeholder={t('請輸入金額')} type="number" pattern="[0-9]*" step="any" required />
              <button onClick={() => { amountRef.current.value = balance, setAmount(balance) }} className="input-group-text border-0 text-primary fw-bold">{t('全部')}</button>
            </div>
          </div>

          <p className='d-flex justify-content-end text-secondary mt-2'><small>{`${t("可提餘額")}: ${balance} USDT`}</small></p>

          <hr />

          {/* 手續費 */}
          <div className="hstack justify-content-between">
            <div className='text-secondary'>{t('手續費')}</div>
            <span>{servicesCharge + ' USDT'}</span>
          </div>

          {/* 實際到帳 */}
          <div className="hstack justify-content-between">
            <div className='text-secondary'>{t('實際到帳')}</div>
            <span>{actualAmount + ' USDT'}</span>
          </div>

        </div>
        <button className='col-12 mt-3 btn btn-primary' onClick={onSubmit} disabled={submitBtnDisabled}>{t('提交')}</button>

        <div id="reader" width="600px"></div>

      </div>
      <TnCFromGts2 />
      <SuccessModal text={'提出申請成功'} />
      <FailModal text={errorFeedback} />
    </>
  )
}

const TnCFromGts2 = () => {
  const [content, setContent] = useState('')
  const getContent = async () => {
    let link;
    switch (i18n.language) {
      case 'tc':
        link = 'https://chestbox.gts2cloud.com/public/ftp_upload/26/fo_document/withdrawal_TermsCondition_zh_TW.html'
        break;
      case 'vn':
        link = 'https://chestbox.gts2cloud.com/public/ftp_upload/26/fo_document/withdrawal_TermsCondition_vi_VN.html'
        break;
      default:
        link = 'https://chestbox.gts2cloud.com/public/ftp_upload/26/fo_document/withdrawal_TermsCondition_en_US.html'
        break;
    }
    if (link === '') return;
    let result = await axios.get(link)
    if (result.status !== 200) return console.error(`${result.status}: ${result.statusText}`)
    setContent(result.data)
  }
  useEffect(() => {
    getContent()
  }, [])
  return (
    <div className='container mt-3' dangerouslySetInnerHTML={{ __html: content }}></div>
  )
}

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ... await serverSideTranslations(locale),
    },
  }
}
export default Withdraw