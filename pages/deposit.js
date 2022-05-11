import { useState, useEffect, useRef } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { i18n, useTranslation } from 'next-i18next'
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/router'
import Navbar from '../components/navbar'
import Lib from '../utils/_lib';
import axios from 'axios';

{/* FIXME: golen egg not supported yet */ }
const DepositByAddress = () => {
  const { t } = useTranslation()
  return (
    <>
      <style jsx>{`
        .tabContent{
          border-radius: 20px;
          font-size: 16px;
        }
        .hstack, div:first-child{
            min-width: 80px;
        }
        hr {
          height: 0.5px;
        }
      `}</style>
      <div className='tabContent bg-white shadow-sm p-3'>
        <div className="hstack">
          <div>{t('類別')}</div>
          <div className="vr mx-2"></div>
          <div className="ms-auto fw-bold">{'USDT-erc20'}</div>
        </div>
        <hr />
        <div className="hstack">
          <div>{t('幣種')}</div>
          <div className="vr mx-2"></div>
          <div className="ms-auto fw-bold text-secondary">USDT</div>
        </div>

      </div>

      <button className='col-12 mt-3 btn btn-primary' disabled>{t('獲取入金地址')}</button>
    </>
  )
}

const DepositByCurrency = ({ gateway }) => {
  const route = useRouter()
  const { t } = useTranslation()
  const [amount, setAmount] = useState('')
  const [submitDepositBtnDisabled, setSubmitDepositBtnDisabled] = useState(true)
  const [getdlResultError, setGetdlResultError] = useState('')
  const [paySwitchSeqId, setPaySwitchSeqId] = useState('')
  const [gatewayList, setGatewayList] = useState([])
  const TOKEN = useSelector(state => state.info.token)

  // 入金
  const depositIndex = async (query) => {
    try {
      let params = {
        ...query,
        service: 'deposit.index',
        display_type: 'm',
        deal_type: 'USDT',
        deposit_type: 'egpay',
        track: Lib.genTrack()
      }
      let result = await (await axios.get('/api/tools', { params: params, headers: { token: TOKEN } })).data
      if (result.ret !== 200) console.error(`${result.ret}: ${result.msg}`)
      return result
    } catch (error) { console.error(error) }
  }

  const onSubmit = async () => {
    let getIpAddressResult = await (await axios.get('/api/getIpAddress')).data

    let depositIndexResult = await depositIndex({
      amount: amount,
      paySwitchSeqId: paySwitchSeqId,
      callbackUrl: `${window.location.origin}/api/getFormData?`,
      orderCreateIp: getIpAddressResult.ip,
    })

    if (depositIndexResult.ret !== 200) return setGetdlResultError('GTS2接口錯誤代碼' + depositIndexResult.msg)

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- EGPay
    function postForm(url, form, method = "post") {
      const formEle = document.createElement("form");
      formEle.method = method;
      formEle.action = url;

      for (const key in form) {
        if (form.hasOwnProperty(key)) {
          const hiddenField = document.createElement("input");
          hiddenField.type = "hidden";
          hiddenField.name = key;
          hiddenField.value = form[key];

          formEle.appendChild(hiddenField);
        }
      }

      document.body.appendChild(formEle);
      formEle.submit();
    }

    postForm(depositIndexResult.data.url, depositIndexResult.data.form)
    Lib.setStorage('post_request', true)
  }

  useEffect(() => {
    if (gateway.length === 0) return;
    if (gateway.ret === 200) {
      setGatewayList(gateway.data.list)
      setPaySwitchSeqId(gateway.data.list[0].paySwitchSeqId)
    } else setGetdlResultError('GTS2接口錯誤代碼' + gateway.msg)
  }, [gateway])

  useEffect(() => {
    amount > 0
      ? setSubmitDepositBtnDisabled(false)
      : setSubmitDepositBtnDisabled(true)
  }, [amount])
  return (
    <>
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
      `}</style>
      <div className='tabContent bg-white shadow-sm p-3'>
        <div className="hstack">
          <div>{t('類別')}</div>
          <div className="vr mx-2"></div>
          <select className="form-select text-info fs-5 fw-bold text-end" aria-label="select gateway" onClick={(e) => setPaySwitchSeqId(e.target.value)}>
            {gatewayList.map(type =>
              <option key={type.paySwitchSeqId} value={type.paySwitchSeqId}>{type.name}</option>
            )}
          </select>
        </div>
        <hr />
        <div className="hstack">
          <div>{t('幣種')}</div>
          <div className="vr mx-2"></div>
          <div className="ms-auto fw-bold text-secondary">USDT</div>
        </div>
        <hr />
        <div className="hstack">
          <div>{t('金額')}</div>
          <div className="vr mx-2"></div>
          <input className="ms-auto form-control" onKeyDown={Lib.preventNumberSymbol} onInput={Lib.input8Decimal} onChange={(e) => setAmount(e.target.value)} placeholder={t('請輸入金額')} type="number" pattern="[0-9]*" step="any" required />
        </div>

      </div>
      <button className='col-12 mt-3 btn btn-primary' onClick={onSubmit} disabled={submitDepositBtnDisabled}>{t('提交')}</button>

      <p className='text-center mt-4' id='error-feedback'>{t(getdlResultError)}</p>
    </>
  )
}

const Deposit = (props) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('egpay')
  const [depositPermission, setDepositPermission] = useState(false)
  const [getdlResultError, setGetdlResultError] = useState('')
  const [order, setOrder] = useState('')
  const [gateWay, setGateWay] = useState([])

  const dispatch = useDispatch()
  const TOKEN = useSelector(state => state.info.token)

  // TODO: do success or fail move
  const updateDepositStatus = async () => {
    if (Lib.getQueryString('pno')) {
      setOrder(Lib.getQueryString('pno'))
      console.log('success deposit');
    } else console.log('fail deposit');

    Lib.setStorage('post_request', false)
  }

  // 入金渠道
  const getdl = async () => {
    try {
      let params = {
        service: 'deposit.getdl',
        deviceType: 'MobileSwitch'
      }
      switch (locale) {
        case 'tc':
          params.lang = 'Tw'
          break;
        case 'vn':
          params.lang = 'Vi'
          break;
        default:
          params.lang = 'En'
          break;
      }
      let result = await (await axios.get(`/api/tools`, { params: params, headers: { token: TOKEN } })).data
      if (result.ret !== 200) console.error(`${result.ret}: ${result.msg}`)
      return setGateWay(result)
    } catch (error) { console.error(error) }
  }
  // 是否可以入金
  const depositpermission = async () => {
    try {
      let params = {
        service: 'deposit.depositpermission',
      }
      let result = await (await axios.get(`/api/tools`, { params: params, headers: { token: TOKEN } })).data
      if (result.ret !== 200) console.error(`${result.ret}: ${result.msg}`)
      return result
    } catch (error) { console.error(error) }
  }

  useEffect(() => {
    (async () => {
      if (TOKEN !== '') {
        let depositpermissionResult = await depositpermission()
        if (depositpermissionResult.ret === 200) {
          setDepositPermission(true)
          getdl()
        } else setGetdlResultError('GTS2接口錯誤代碼' + depositpermissionResult.msg)
      }
    })()
  }, [TOKEN])

  useEffect(() => {
    dispatch({ type: 'ADD_INFO', payload: Lib.getInfo() })
    if (Lib.getStorage('post_request') === 'true') updateDepositStatus()
  }, [])
  return (
    <>
      <style jsx>{`
        #error-feedback{
          font-size: 16px;
          color: #F2608C;
        }`}</style>
      <Navbar head={{ name: '入金 (充幣)', link: () => Lib.pushView(11) }} detail={() => router.push({ pathname: '/detail', query: { page: 'deposit' }, locale: router.locale })} className="bg-blue" />
      <div className='container mt-2'>
        <div className='d-flex'>
          {/* TODO: remove disabled */}
          <button disabled className={`col mx-1 btn ${activeTab === 'goldenegg' ? 'btn-light shadow-sm active' : 'btn-inactive'}`} onClick={() => setActiveTab('goldenegg')}>{t('入金地址')}</button>
          <button className={`col mx-1 btn ${activeTab === 'egpay' ? 'btn-light shadow-sm active' : 'btn-inactive'}`} onClick={() => setActiveTab('egpay')}>{t('直接支付')}</button>
        </div>
        <div className='mt-2'>
          {activeTab === 'goldenegg'
            ? <DepositByAddress />
            : <DepositByCurrency gateway={gateWay} />
          }
        </div>
        <p className='text-center mt-4' id='error-feedback'>{t(getdlResultError)}</p>
        {/* TODO: maybe have success modal */}
        {/* <h1>{order}</h1> */}

      </div>
    </>
  )
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...await serverSideTranslations(locale),
    },
  }
}
export default Deposit