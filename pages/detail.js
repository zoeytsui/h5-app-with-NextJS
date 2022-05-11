import { useState, useEffect, useRef } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router';
import Lib from '../utils/_lib';
import axios from 'axios';
import Navbar from '../components/navbar'
import NoData from '../components/noData';

const Deposit = (props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const page = new URLSearchParams(router.asPath.replace('/detail', '')).get('page')

  const [pageList, setPageList] = useState([])

  const dispatch = useDispatch()
  const TOKEN = useSelector(state => state.info.token)

  // 入金出金列表
  const getlist = async (query) => {
    try {
      let params = {
        ...query,
        pageNo: 1,
        pageSize: 100
      }
      let result = await (await axios.get('/api/tools', { params: params, headers: { token: TOKEN } })).data
      if (result.ret !== 200) console.error(`${result.ret}: ${result.msg}`)
      return result
    } catch (error) { console.error(error) }
  }

  const getPageList = async () => {
    let getListResult;
    if (page === 'deposit') {
      getListResult = await getlist({ service: 'deposit.depositlist' })
    } else getListResult = await getlist({ service: 'withdraw.withdrawlist' })

    if (getListResult.ret !== 200 || getListResult.data.total === 0) return;
    setPageList(getListResult.data.list)
    console.log(getListResult);
  }

  useEffect(() => {
    if (TOKEN !== '') {
      getPageList()
    }
  }, [TOKEN])
  useEffect(() => {
    dispatch({ type: 'ADD_INFO', payload: Lib.getInfo() })
  }, [])

  return (
    <>
      {page === 'deposit'
        ? <Navbar head={{ name: '資金明細', link: () => Lib.pushView(11) }} className="bg-blue" />
        : <Navbar head={{ name: '取款紀錄', link: () => Lib.pushView(11) }} className="bg-blue" />
      }
      <div className='container'>
        {pageList.length > 0
          ? pageList.map((x, i) => <Stack list={x} page={page} key={i} />)
          : <NoData />}
      </div>
    </>
  )
}

const Stack = ({ list, page }) => {
  const { t } = useTranslation()

  const statusHandler = (code) => {
    let msg = {
      '0': '待確認',
      '1': '待審批',
      '2': '已審批',
      '-1': '已取消',
      '-2': '逾期',
      '4': '取款失败'
    }
    return msg[code]
  }
  const depositeStatusHandler = (code) => {
    let msg = {
      '0': '未入賬',
      '1': '入賬失敗',
      '2': '已成功入帳',
    }
    return msg[code]
  }
  return (
    <>
      <style jsx>{`
        #stack{
          border-radius:10px;
        }
      `}</style>
      <div className='bg-white shadow-sm p-3 my-3' id="stack">
        <div className='hstack'>
          <div>{t('提交時間')}</div>
          <div className="ms-auto text-secondary">{list.proposalDate}</div>
        </div>
        <div className='hstack'>
          {page === 'deposit'
            ? <>
              <div>{t('入金狀態')}</div>
              <div className={`ms-auto ${list.depositeStatus === '2' ? 'text-success' : list.depositeStatus === '1' ? 'text-danger' : 'text-info'}`}>
                {t(depositeStatusHandler(list.depositeStatus))}
              </div>
            </>
            : <>
              <div>{t('申請狀態')}</div><div className={`ms-auto ${list.proposalStatus === '2' ? 'text-success' : list.proposalStatus === '0' || list.proposalStatus === '1' ? 'text-info' : 'text-danger'}`}>
                {t(statusHandler(list.proposalStatus))}
              </div>
            </>
          }
        </div>
        <div className='hstack'>
          <div>{t('金額')}</div>
          <div className="ms-auto text-secondary">{list.payAmount + ' USDT'}</div>
        </div>
        <div className='hstack'>
          <div>{t('貨幣鏈')}</div>
          <div className="ms-auto text-secondary">erc20</div>
        </div>
        <div className='hstack'>
          <div>{t('提案號')}</div>
          <div className="ms-auto text-secondary">{list.pno}</div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ... await serverSideTranslations(locale),
    },
  }
}
export default Deposit