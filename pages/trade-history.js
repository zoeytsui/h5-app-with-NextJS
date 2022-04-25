import { useState, useEffect, useRef, createRef } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { i18n, useTranslation } from 'next-i18next'
import Lib from '../utils/_lib';
import axios from 'axios';
import Image from 'next/image'

import { Box, Tab, TextField, Grid, Divider } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, CalendarPicker, DesktopDatePicker, DatePicker } from '@mui/x-date-pickers';

import timeICON from '../public/images/timeICON.png'
import nextBTN_blue from '../public/images/nextBTN_blue.png'
import buyICON from '../public/images/buyICON.png'
import sellICON from '../public/images/sellICON.png'
import NoData from '../components/noData';

import { sub, formatISO9075, getUnixTime, parseISO } from 'date-fns'
import Link from 'next/link';

const TradeHistory = (props) => {
  const { t } = useTranslation()
  const [now, setNow] = useState('')
  const starttimeRef = createRef()
  const endtimeRef = createRef()

  const [activeTab, setActiveTab] = useState('1');
  const [queryObj, setQueryObj] = useState({})
  const [dataList, setDataList] = useState([])

  const [isReady, setIsReady] = useState(false)
  const [recordType, setRecordType] = useState('交易紀錄')
  const [filterActive, setFilterActive] = useState(false)
  const [tradelistsFilter, setTradelistsFilter] = useState({})
  const [orderlistsFilter, setOrderlistsFilter] = useState({})
  const [balancelistsFilter, setBalancelistsFilter] = useState({})
  const [pllistsFilter, setPllistsFilter] = useState({})
  const [symbollist, setSymbollist] = useState([])

  // TODO: increase pagesize by sroll down
  // TODO: filter add date params
  // 历史交易列表
  const getDealTradelists = async (query) => {
    try {
      let params = {
        service: 'deal.tradelists',
        ...query,
      }
      let result = await (await axios.get('/api/cms', { params: params, headers: { token: Lib.getInfo().token } })).data
      if (result.ret !== 200) return console.error(`${result.ret}: ${result.msg}`)
      setDataList(result.data.list)
      // console.log('交易紀錄', result.data);
    } catch (error) { console.error(error) }
  }
  // 委託訂單列表
  const getDealOrderlists = async (query) => {
    try {
      let params = {
        service: 'deal.orderlists',
        ...query,
      }
      let result = await (await axios.get('/api/cms', { params: params, headers: { token: Lib.getInfo().token } })).data
      if (result.ret !== 200) return console.error(`${result.ret}: ${result.msg}`)
      setDataList(result.data.list)
      // console.log('委託紀錄', result.data);
    } catch (error) { console.error(error) }
  }
  // 盈亏列表
  const getDealPllists = async (query) => {
    try {
      let params = {
        service: 'deal.pllists',
        ...query,
      }
      let result = await (await axios.get('/api/cms', { params: params, headers: { token: Lib.getInfo().token } })).data
      if (result.ret !== 200) return console.error(`${result.ret}: ${result.msg}`)
      setDataList(result.data.list)
      // console.log('盈亏列表', result.data);
    } catch (error) { console.error(error) }
  }
  // 额度记录
  const getDealBalancelists = async (query) => {
    try {
      let params = {
        service: 'deal.balancelists',
        ...query,
      }
      let result = await (await axios.get('/api/cms', { params: params, headers: { token: Lib.getInfo().token } })).data
      if (result.ret !== 200) return console.error(`${result.ret}: ${result.msg}`)
      setDataList(result.data.list)
      // console.log('额度记录', result.data);
    } catch (error) { console.error(error) }
  }
  // 交易產品獲取
  const getDealSymbollist = async () => {
    try {
      let params = {
        service: 'deal.symbollist'
      }
      let result = await (await axios.get('/api/cms', { params: params, headers: { token: Lib.getInfo().token } })).data
      if (result.ret !== 200) return console.error(`${result.ret}: ${result.msg}`)
      setSymbollist(result.data)
      // console.log('交易產品獲取', result);
    } catch (error) { console.error(error) }
  }

  // nav filter
  const filterBtnHandler = () => {
    let hiddenEle = document.getElementById('filterHiddenContent'),
      navEle = document.getElementById('navHeader')
    if (filterActive) {
      setFilterActive(false)
      hiddenEle.setAttribute('hidden', '')
      navEle.classList.remove('position-absolute')
    } else {
      setFilterActive(true)
      hiddenEle.removeAttribute('hidden')
      navEle.classList.add('position-absolute')
    }
  }
  const updateFilter = (e, newVal) => {
    let filterGroupEle = e.target.parentElement.parentElement.parentElement,
      parentEle = e.target.parentElement.parentElement;

    Array.from(parentEle.children).map(btn => btn.children[0].classList.remove('active'))
    e.target.classList.add('active')

    if (filterGroupEle.id === '交易紀錄') {
      switch (parentEle.id) {
        case 'orderType':
          setTradelistsFilter(prev => ({ ...prev, orderType: newVal }))
          break;
        case 'reportType':
          setTradelistsFilter(prev => ({ ...prev, reportType: newVal }))
          break;
        case 'direction':
          setTradelistsFilter(prev => ({ ...prev, direction: newVal }))
          break;
        case 'symbol':
          setTradelistsFilter(prev => ({ ...prev, symbol: newVal }))
          break;
      }
    } else if (filterGroupEle.id === '委託紀錄') {
      switch (parentEle.id) {
        case 'status':
          setOrderlistsFilter(prev => ({ ...prev, status: newVal }))
          break;
        case 'symbol':
          setOrderlistsFilter(prev => ({ ...prev, symbol: newVal }))
          break;
      }

    } else if (filterGroupEle.id === '盈虧紀錄') {
      switch (parentEle.id) {
        case 'orderType':
          setPllistsFilter(prev => ({ ...prev, orderType: newVal }))
          break;
        case 'openDirection':
          setPllistsFilter(prev => ({ ...prev, openDirection: newVal }))
          break;
        case 'symbol':
          setPllistsFilter(prev => ({ ...prev, symbol: newVal }))
          break;
      }
    } else {
      switch (parentEle.id) {
        case 'balanceReportType':
          setBalancelistsFilter(prev => ({ ...prev, reportType: newVal }))
          break;
      }
    }
  }

  const clearFilter = async () => {
    setTradelistsFilter({})
    setOrderlistsFilter({})
    setPllistsFilter({})
    setBalancelistsFilter({})

    await Array.from(document.getElementById('filterList').getElementsByClassName('active')).map(ele => ele.classList.remove('active'));
    Array.from(document.querySelectorAll('#filterList > div > .row')).map(row => row.children[0].children[0].classList.add('active'))
  }
  const submitFilter = (e) => {
    e.preventDefault()
    let filterGroup = e.target.parentElement.previousElementSibling.children[0]
    switch (filterGroup.id) {
      case '交易紀錄':
        getDealTradelists({ ...tradelistsFilter })
        break;
      case '委託紀錄':
        getDealOrderlists({ ...orderlistsFilter })
        break;
      case '盈虧紀錄':
        getDealPllists({ ...pllistsFilter })
        break;
      case '額度紀錄':
        getDealBalancelists({ ...balancelistsFilter })
        break;
    }
    filterBtnHandler()
  }

  // date filter
  const updateDateFilter = () => {
    if (starttimeRef.current.value !== '' && endtimeRef.current.value !== '') {
      getDealTradelists({
        starttime: getUnixTime(new Date(starttimeRef.current.value)),
        endtime: getUnixTime(new Date(endtimeRef.current.value))
      })
    }
  }

  useEffect(() => {
    getDealTradelists({ starttime: getUnixTime(parseISO(new Date().toISOString().split('T')[0])) })
    setNow(formatISO9075(new Date()))
    getDealSymbollist()
    clearFilter()
  }, [])

  return (
    <>
      <style jsx>{`
        .btn-tab {
          font-weight: normal !important;
          font-size: 12px !important;
          color: #949494;
          border-radius: 0;
        }
        .btn-tab.active {
          font-weight: bold !important;
          color: #293878;
          border-bottom: 2px #293878 solid;
        }
        #dateFilterModal .modal-dialog {
          position: absolute;
          bottom: 0;
          margin: 0;
          width: 100%;
        }
        #dateFilterModal .modal-content {
          border-radius: 20px 20px 0px 0px;
          border: 0;
        }
        #dateFilterModal .modal-header, #dateFilterModal .modal-footer {
          border: 0;
        }
        .btn-outline-secondary{
          font-size: 12px !important;
          padding-left: 0;
          padding-right: 0;
        }
        .btn-outline-secondary.active{
          color: #FFFFFF;
          background: #68BBD9;
          border-color: #68BBD9;
        }
        .btn-outline-primary:active,
        .btn-outline-primary:hover{
          color: #FFFFFF;
        }
      `}</style>

      {/* Nav */}
      <div className='bg-blue' id="navHeader" style={{ borderRadius: '0 0 20px 20px', zIndex: 1, width: '100%' }}>
        <nav className={`nav align-items-center text-white py-4`}>
          <button className='btn text-white position-absolute start-0' onClick={() => Lib.pushView(11)}>
            <i className="bi bi-chevron-left"></i>
          </button>

          <p style={{ fontSize: '18px', fontWeight: 400 }} className='mx-auto my-0'>{t('歷史成交')}</p>

          <button className='btn position-absolute end-0' onClick={filterBtnHandler}>
            {filterActive ? <FilterBtnSVG color='#F6DE8B' /> : <FilterBtnSVG color='#E2E1E1' />}
          </button>
        </nav>
        <div className='container pb-3' id="filterHiddenContent" hidden>
          <select className="form-select text-primary fs-5 fw-bold text-center" id='DealTypeSelection' onChange={(e) => { setRecordType(e.target.value); clearFilter() }} aria-label="select deal list">
            {DataListType.records.map(record =>
              <option key={record} value={record}>{t(record)}</option>
            )}
          </select>
          <div id='filterList'>
            {recordType === '交易紀錄'
              ? <div id='交易紀錄'>
                {/* 類型 */}
                <div className='text-primary my-2'>{t('類型')}</div>
                <div className='row row-cols-3 g-2' id='orderType'>
                  {DataListType.orderType.map(li =>
                    <div className='col' key={li.label}>
                      <button className={`col-12 btn btn-outline-secondary`} onClick={(e) => updateFilter(e, li.value)}>{t(li.label)}</button>
                    </div>
                  )}
                </div>
                {/* 類別 */}
                <div className='text-primary my-2'>{t('類別')}</div>
                <div className='row row-cols-3 g-2' id="reportType">
                  {DataListType.reportType.map(li =>
                    <div className='col' key={li.label}>
                      <button className={`col-12 btn btn-outline-secondary`} onClick={(e) => updateFilter(e, li.value)}>{t(li.label)}</button>
                    </div>
                  )}
                </div>
                {/* 方向 */}
                <div className='text-primary my-2'>{t('方向')}</div>
                <div className='row row-cols-3 g-2' id="direction">
                  {DataListType.direction.map(li =>
                    <div className='col' key={li.label}>
                      <button className={`col-12 btn btn-outline-secondary`} onClick={(e) => updateFilter(e, li.value)}>{t(li.label)}</button>
                    </div>
                  )}
                </div>
                {/* 產品 */}
                <div className='text-primary my-2'>{t('產品')}</div>
                <div className='row row-cols-3 g-2' id="symbol">
                  <div className='col'>
                    <button className={`col-12 btn btn-outline-secondary`} onClick={(e) => updateFilter(e, '')}>{t('全部')}</button>
                  </div>
                  {symbollist.map(li =>
                    <div className='col' key={li.name}>
                      <button className={`col-12 btn btn-outline-secondary`} onClick={(e) => updateFilter(e, li.name)}>{t(li.displayName)}</button>
                    </div>
                  )}
                </div>
              </div>
              : recordType === '委託紀錄'
                ? <div id='委託紀錄'>
                  {/* 狀態 */}
                  <div className='text-primary my-2'>{t('狀態')}</div>
                  <div className='row row-cols-3 g-2' id='status'>
                    {DataListType.status.map(li =>
                      <div className='col' key={li.label}>
                        <button className={`col-12 btn btn-outline-secondary`} onClick={(e) => updateFilter(e, li.value)}>{t(li.label)}</button>
                      </div>
                    )}
                  </div>
                  {/* 產品 */}
                  <div className='text-primary my-2'>{t('產品')}</div>
                  <div className='row row-cols-3 g-2' id="symbol">
                    <div className='col'>
                      <button className={`col-12 btn btn-outline-secondary`} onClick={(e) => updateFilter(e, '')}>{t('全部')}</button>
                    </div>
                    {symbollist.map(li =>
                      <div className='col' key={li.name}>
                        <button className={`col-12 btn btn-outline-secondary`} onClick={(e) => updateFilter(e, li.name)}>{t(li.displayName)}</button>
                      </div>
                    )}
                  </div>
                </div>
                : recordType === '盈虧紀錄'
                  ? <div id='盈虧紀錄'>
                    {/* 狀態 */}
                    <div className='text-primary my-2'>{t('類型')}</div>
                    <div className='row row-cols-3 g-2' id='orderType'>
                      {DataListType.status.map(li =>
                        <div className='col' key={li.label}>
                          <button className={`col-12 btn btn-outline-secondary`} onClick={(e) => updateFilter(e, li.value)}>{t(li.label)}</button>
                        </div>
                      )}
                    </div>
                    {/* 方向 */}
                    <div className='text-primary my-2'>{t('方向')}</div>
                    <div className='row row-cols-3 g-2' id='openDirection'>
                      {DataListType.direction.map(li =>
                        <div className='col' key={li.label}>
                          <button className={`col-12 btn btn-outline-secondary`} onClick={(e) => updateFilter(e, li.value)}>{t(li.label)}</button>
                        </div>
                      )}
                    </div>
                    {/* 產品 */}
                    <div className='text-primary my-2'>{t('產品')}</div>
                    <div className='row row-cols-3 g-2' id="symbol">
                      <div className='col'>
                        <button className={`col-12 btn btn-outline-secondary`} onClick={(e) => updateFilter(e, '')}>{t('全部')}</button>
                      </div>
                      {symbollist.map(li =>
                        <div className='col' key={li.name}>
                          <button className={`col-12 btn btn-outline-secondary`} onClick={(e) => updateFilter(e, li.name)}>{t(li.displayName)}</button>
                        </div>
                      )}
                    </div>
                  </div>
                  : <div id='額度紀錄'>
                    {/* 狀態 */}
                    <div className='text-primary my-2'>{t('項目')}</div>
                    <div className='row row-cols-3 g-2' id='reportType'>
                      {DataListType.balanceReportType.map(li =>
                        <div className='col' key={li.label}>
                          <button className={`col-12 btn btn-outline-secondary`} onClick={(e) => updateFilter(e, li.value)}>{t(li.label)}</button>
                        </div>
                      )}
                    </div>
                  </div>
            }
          </div>

          <div className='row my-3'>
            <div className='col btn btn-outline-primary mx-2' onClick={clearFilter}>{t('重置')}</div>
            <div className='col btn btn-primary mx-2' onClick={submitFilter}>{t('確定')}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='container'>
        <div className='nav'>
          <button className={`btn btn-tab ${activeTab === '1' ? 'active' : ''}`} onClick={() => { setActiveTab('1'); getDealTradelists({ starttime: getUnixTime(parseISO(new Date().toISOString().split('T')[0])) }) }}>{t('即日')}</button>
          <button className={`btn btn-tab ${activeTab === '2' ? 'active' : ''}`} onClick={() => { setActiveTab('2'); getDealTradelists({ starttime: getUnixTime(sub(new Date(), { weeks: 1 })), endtime: getUnixTime(new Date()) }) }}>{t('最近一週')}</button>
          <button className={`btn btn-tab ${activeTab === '3' ? 'active' : ''}`} onClick={() => { setActiveTab('3'); getDealTradelists({ starttime: getUnixTime(sub(new Date(), { months: 1 })), endtime: getUnixTime(new Date()) }) }}>{t('最近一月')}</button>

          <button className={`border-0 bg-transparent d-flex align-items-center ms-auto ${activeTab === '4' ? 'active' : ''}`} onClick={() => setActiveTab('4')} data-bs-toggle="modal" data-bs-target="#dateFilterModal">
            <span>{t('時間查詢')}</span>
            <div className='vr m-2'></div>
            <Image src={timeICON} width={20} height={20} alt={t('時間查詢')} />
          </button>
        </div>
        <hr />
        {/* <div className='text-secondary text-center mt-2'>{now}</div> */}

        {dataList.length > 0
          ? dataList.map((list, index) =>
            list.exectime !== undefined
              ? <TradeListsStack key={index} list={list} />
              : list.requesttime !== undefined
                ? <OrderListsStack key={index} list={list} />
                : list.openNo !== undefined
                  ? <PlListsStack key={index} list={list} />
                  : <BalanceListsStack key={index} list={list} />
          )
          : <NoData />}
      </div>

      {/* dateFilterModal */}
      <div className='modal' id='dateFilterModal' tabIndex="-1" aria-hidden="true">
        <div className='modal-dialog' style={{ maxWidth: 'unset' }}>
          <div className='modal-content'>
            <div className="d-flex align-items-center my-3">
              <div className="modal-title fs-5 mx-auto">{t('請選擇日期')}</div>
              <button type="button" className="btn-close position-absolute end-0 mx-3" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className='d-flex justify-content-center'>
              <input type='date' className='mx-2' ref={starttimeRef} max={new Date().toISOString().split('T')[0]} />
              <hr style={{ width: '10px', height: '2px' }} />
              <input type='date' className='mx-2' ref={endtimeRef} max={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="modal-footer">
              <button className="col btn btn-outline-primary" data-bs-dismiss="modal">{t('取消')}</button>
              <button className="col btn btn-primary" data-bs-dismiss="modal" onClick={updateDateFilter}>{t('確定')}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const TradeListsStack = ({ list }) => {
  const { t } = useTranslation()
  return (
    <>
      <button className='container d-flex align-items-center bg-white border-0 shadow-sm p-3 my-3' data-bs-toggle="modal" data-bs-target="#asd" style={{ borderRadius: '10px', textDecoration: 'none' }}>
        <div className='col'>
          <div className='hstack'>
            <div className="text-info">{t('交易時間')}</div>
            <div className="ms-auto text-secondary">{formatISO9075(new Date(parseInt(list.exectime * 1000))).toString()}</div>
          </div>
          <div className='hstack'>
            <div className="text-info">{t('成交號')}</div>
            <div className="ms-auto text-secondary">{list.dealId}</div>
          </div>
          <div className='hstack'>
            <div className="text-info">{t('交易產品')}</div>
            <div className="ms-auto text-secondary">{list.displayName}</div>
          </div>
        </div>
        <div className='ms-2'>
          <Image src={nextBTN_blue} width={6} height={10} alt={''} />
        </div>
      </button>

      <div className='modal' id='asd' tabIndex="-1" aria-hidden="true">
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content border-0 p-3 m-3' id="stack" style={{ borderRadius: "10px" }}>

            <div className='d-flex mb-3'>
              {list.direction === 'BUY'
                ? <Image src={buyICON} width={22} height={22} alt={t('歷史成交')} />
                : <Image src={sellICON} width={22} height={22} alt={t('歷史成交')} />}
              <div className={`fs-5 ms-2 ${list.direction === 'BUY' ? 'text-success' : 'text-danger'}`}>{list.displayName}</div>

              <button type="button" className="btn-close position-absolute end-0 ms-auto mx-3" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className='hstack'>
              <div>{t('成交時間') + ": "}</div>
              <div className="ms-auto">{formatISO9075(new Date(list.exectime * 1000)).toString()}</div>
            </div>
            <div className='hstack'>
              <div>{t('成交號') + ": "}</div>
              <div className="ms-auto">{list.dealId}</div>
            </div>
            <div className='hstack'>
              <div>{t('類型') + ": "}</div>
              <div className="ms-auto">{t(DataListType.orderType.find(li => li.value == list.orderType).label)}</div>
            </div>
            <div className='hstack'>
              <div>{t('類別') + ": "}</div>
              <div className="ms-auto">{t(DataListType.reportType.find(li => li.value == list.reportType).label)}</div>
            </div>
            <div className='hstack'>
              <div>{t('方向') + ": "}</div>
              <div className="ms-auto">{t(DataListType.direction.find(li => li.value == list.direction).label)}</div>
            </div>
            <div className='hstack'>
              <div>{t('手數') + ": "}</div>
              <div className="ms-auto">{list.execvolume}</div>
            </div>
            <div className='hstack'>
              <div>{t('成交價') + ": "}</div>
              <div className="ms-auto">{list.execprice}</div>
            </div>
            <div className='hstack'>
              <div>{t('點差回贈') + ": "}</div>
              <div className="ms-auto">{list.commission}</div>
            </div>
            <div className='hstack'>
              <div>{t('持倉號') + ": "}</div>
              <div className="ms-auto">{list.positionId}</div>
            </div>
            <div className='hstack'>
              <div>{t('備註') + ": "}</div>
              <div className="ms-auto">{list.remark}</div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
const OrderListsStack = ({ list }) => {
  const { t } = useTranslation()
  return (
    <>
      <button className='container d-flex align-items-center bg-white border-0 shadow-sm p-3 my-3' data-bs-toggle="modal" data-bs-target="#asd" style={{ borderRadius: '10px', textDecoration: 'none' }}>
        <div className='col'>
          <div className='hstack'>
            <div className="text-info">{t('交易時間')}</div>
            <div className="ms-auto text-secondary">{formatISO9075(new Date(parseInt(list.requesttime * 1000))).toString()}</div>
          </div>
          <div className='hstack'>
            <div className="text-info">{t('成交號')}</div>
            <div className="ms-auto text-secondary">{list.orderid}</div>
          </div>
          <div className='hstack'>
            <div className="text-info">{t('交易產品')}</div>
            <div className="ms-auto text-secondary">{list.name}</div>
          </div>
        </div>
        <div className='ms-2'>
          <Image src={nextBTN_blue} width={6} height={10} alt={''} />
        </div>
      </button>

      <div className='modal' id='asd' tabIndex="-1" aria-hidden="true">
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content border-0 p-3 m-3' id="stack" style={{ borderRadius: "10px" }}>

            <div className='d-flex mb-3'>
              {list.direction === 'BUY'
                ? <Image src={buyICON} width={22} height={22} alt={t('歷史成交')} />
                : <Image src={sellICON} width={22} height={22} alt={t('歷史成交')} />}
              <div className={`fs-5 ms-2 ${list.direction === 'BUY' ? 'text-success' : 'text-danger'}`}>{list.name}</div>

              <button type="button" className="btn-close position-absolute end-0 ms-auto mx-3" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className='hstack'>
              <div>{t('成交時間') + ": "}</div>
              <div className="ms-auto">{formatISO9075(new Date(parseInt(list.requesttime * 1000))).toString()}</div>
            </div>
            <div className='hstack'>
              <div>{t('成交號') + ": "}</div>
              <div className="ms-auto">{list.orderid}</div>
            </div>
            <div className='hstack'>
              <div>{t('產品') + ": "}</div>
              <div className="ms-auto">{list.name}</div>
            </div>
            <div className='hstack'>
              <div>{t('類型') + ": "}</div>
              <div className="ms-auto">{t(DataListType.orderType.find(li => li.value == list.type).label)}</div>
            </div>
            <div className='hstack'>
              <div>{t('類別') + ": "}</div>
              <div className="ms-auto">{t(DataListType.reportType.find(li => li.value == list.kind).label)}</div>
            </div>
            <div className='hstack'>
              <div>{t('方向') + ": "}</div>
              <div className="ms-auto">{t(DataListType.direction.find(li => li.value == list.direction).label)}</div>
            </div>
            <div className='hstack'>
              <div>{t('手數') + ": "}</div>
              <div className="ms-auto">{list.requestvolume}</div>
            </div>
            <div className='hstack'>
              <div>{t('成交價') + ": "}</div>
              <div className="ms-auto">{list.execprice}</div>
            </div>
            <div className='hstack'>
              <div>{t('掛單價') + ": "}</div>
              <div className="ms-auto">{list.requestprice}</div>
            </div>
            <div className='hstack'>
              <div>{t('止盈') + ": "}</div>
              <div className="ms-auto">{list.stoploss}</div>
            </div>
            <div className='hstack'>
              <div>{t('止損') + ": "}</div>
              <div className="ms-auto">{list.takeprofit}</div>
            </div>
            <div className='hstack'>
              <div>{t('狀態') + ": "}</div>
              <div className="ms-auto">{t(DataListType.status.find(li => li.value == list.status).label)}</div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
const PlListsStack = ({ list }) => {
  const { t } = useTranslation()
  return (
    <>
      <button className='container d-flex align-items-center bg-white border-0 shadow-sm p-3 my-3' data-bs-toggle="modal" data-bs-target="#asd" style={{ borderRadius: '10px', textDecoration: 'none' }}>
        <div className='col'>
          <div className='hstack'>
            <div className="text-info">{t('成交號')}</div>
            <div className="ms-auto text-secondary">{list.dealId}</div>
          </div>
          <div className='hstack'>
            <div className="text-info">{t('交易產品')}</div>
            <div className="ms-auto text-secondary">{list.displayName}</div>
          </div>
          <div className='hstack'>
            <div className="text-info">{t('類型')}</div>
            <div className="ms-auto text-secondary">{t(DataListType.orderType.find(li => li.value == list.orderType).label)}</div>
          </div>
          <div className='hstack'>
            <div className="text-info">{t('盈虧')}</div>
            <div className="ms-auto text-secondary">{list.profit}</div>
          </div>
        </div>
        <div className='ms-2'>
          <Image src={nextBTN_blue} width={6} height={10} alt={''} />
        </div>
      </button>
      <div className='modal' id='asd' tabIndex="-1" aria-hidden="true">
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content border-0 p-3 m-3' id="stack" style={{ borderRadius: "10px" }}>
            <div className='d-flex mb-3'>
              {list.direction === 'BUY'
                ? <Image src={buyICON} width={22} height={22} alt={t('歷史成交')} />
                : <Image src={sellICON} width={22} height={22} alt={t('歷史成交')} />}
              <div className={`fs-5 ms-2 ${list.direction === 'BUY' ? 'text-success' : 'text-danger'}`}>{list.displayName}</div>
              <button type="button" className="btn-close position-absolute end-0 ms-auto mx-3" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className='hstack'>
              <div>{t('成交號') + ": "}</div>
              <div className="ms-auto">{list.dealId}</div>
            </div>
            <div className='hstack'>
              <div>{t('產品') + ": "}</div>
              <div className="ms-auto">{list.displayName}</div>
            </div>
            <div className='hstack'>
              <div>{t('類型') + ": "}</div>
              <div className="ms-auto">{t(DataListType.orderType.find(li => li.value == list.orderType).label)}</div>
            </div>
            <div className='hstack'>
              <div>{t('方向') + ": "}</div>
              <div className="ms-auto">{t(DataListType.direction.find(li => li.value == list.openDirection).label)}</div>
            </div>
            <div className='hstack'>
              <div>{t('平倉手數') + ": "}</div>
              <div className="ms-auto">{list.tradeVolume}</div>
            </div>
            <div className='hstack'>
              <div>{t('平倉價格') + ": "}</div>
              <div className="ms-auto">{list.tradePrice}</div>
            </div>
            <div className='hstack'>
              <div>{t('開倉價格') + ": "}</div>
              <div className="ms-auto">{list.openPrice}</div>
            </div>
            <div className='hstack'>
              <div>{t('利息') + ": "}</div>
              <div className="ms-auto">{list.swap}</div>
            </div>
            <div className='hstack'>
              <div>{t('盈虧') + ": "}</div>
              <div className="ms-auto">{list.profit}</div>
            </div>
            <div className='hstack'>
              <div>{t('點差回贈') + ": "}</div>
              <div className="ms-auto">{list.commission}</div>
            </div>
            <div className='hstack'>
              <div>{t('持倉號') + ": "}</div>
              <div className="ms-auto">{list.openNo}</div>
            </div>
            <div className='hstack'>
              <div>{t('備註') + ": "}</div>
              <div className="ms-auto">{list.remark}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
const BalanceListsStack = ({ list }) => {
  const { t } = useTranslation()
  return (
    <>
      <button className='container d-flex align-items-center bg-white border-0 shadow-sm p-3 my-3' data-bs-toggle="modal" data-bs-target="#asd" style={{ borderRadius: '10px', textDecoration: 'none' }}>
        <div className='col'>
          <div className='hstack'>
            <div className="text-info">{t('交易時間')}</div>
            <div className="ms-auto text-secondary">{formatISO9075(new Date(parseInt(list.jointime * 1000))).toString()}</div>
          </div>
          <div className='hstack'>
            <div className="text-info">{t('項目')}</div>
            <div className="ms-auto text-secondary">{t(DataListType.balanceReportType.find(li => li.value == list.reportType).label)}</div>
          </div>
          <div className='hstack'>
            <div className="text-info">{t('變動前額度')}</div>
            <div className="ms-auto text-secondary">{list.amountSrc}</div>
          </div>
          <div className='hstack'>
            <div className="text-info">{t('收入')}</div>
            <div className="ms-auto text-secondary">{list.income}</div>
          </div>
          <div className='hstack'>
            <div className="text-info">{t('支出')}</div>
            <div className="ms-auto text-secondary">{list.expenditure}</div>
          </div>
        </div>
        <div className='ms-2'>
          <Image src={nextBTN_blue} width={6} height={10} alt={''} />
        </div>
      </button>

      <div className='modal' id='asd' tabIndex="-1" aria-hidden="true">
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content border-0 p-3 m-3' id="stack" style={{ borderRadius: "10px" }}>

            <div className='d-flex mb-4'>
              <button type="button" className="btn-close position-absolute end-0 ms-auto mx-3" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className='hstack'>
              <div>{t('成交時間') + ": "}</div>
              <div className="ms-auto">{formatISO9075(new Date(list.jointime * 1000)).toString()}</div>
            </div>
            <div className='hstack'>
              <div>{t('項目') + ": "}</div>
              <div className="ms-auto">{t(DataListType.balanceReportType.find(li => li.value == list.reportType).label)}</div>
            </div>
            <div className='hstack'>
              <div>{t('變動前額度') + ": "}</div>
              <div className="ms-auto">{list.amountSrc}</div>
            </div>
            <div className='hstack'>
              <div>{t('收入') + ": "}</div>
              <div className="ms-auto">{list.income}</div>
            </div>
            <div className='hstack'>
              <div>{t('支出') + ": "}</div>
              <div className="ms-auto">{list.expenditure}</div>
            </div>
            <div className='hstack'>
              <div>{t('變動後額度') + ": "}</div>
              <div className="ms-auto">{list.amountDst}</div>
            </div>
            <div className='hstack'>
              <div>{t('流水號') + ": "}</div>
              <div className="ms-auto">{list.pno}</div>
            </div>
            <div className='hstack'>
              <div>{t('備註') + ": "}</div>
              <div className="ms-auto">{list.remark}</div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

const DataListType = {
  records: ['交易紀錄', '委託紀錄', '盈虧紀錄', '額度紀錄'],
  orderType: [
    { label: '全部', value: '' },
    { label: '市價', value: '1' },
    { label: '限價', value: '2' },
    { label: '停損', value: '4' },
    { label: '止盈', value: '16' },
    { label: '止損', value: '32' }
  ],
  direction: [
    { label: '全部', value: '' },
    { label: '賣', value: 'SELL' },
    { label: '買', value: 'BUY' }
  ],
  reportType: [
    { label: '全部', value: '' },
    { label: '開倉', value: 'OPEN' },
    { label: '平倉', value: 'CLOSE' }
  ],
  status: [
    { label: '全部', value: '' },
    { label: '已成交', value: '2' },
    { label: '手動取消', value: '5' },
    { label: '已拒絕', value: '6' },
    { label: '系統取消', value: '9' },
  ],
  balanceReportType: [
    { label: '全部', value: '' },
    { label: '存款', value: '100' },
    { label: '人工存款', value: '102' },
    { label: '取款', value: '200' },
    { label: '轉出', value: '201' },
    { label: '開倉佣金', value: '81' },
    { label: '轉入', value: '101' },
    { label: '盈虧', value: '-130' },
    { label: '清零', value: '-132' },
    { label: '獎勵送出', value: '1001' },
    { label: '獎勵扣回', value: '1002' },
    { label: '贈金', value: '-133' },
    { label: '活動贈金', value: '501' },
    { label: '額度調整', value: '300' },
    { label: '交易編碼扣費', value: '503' },
    { label: '交易編碼退費', value: '504' },
  ]
}

const FilterBtnSVG = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill={color} d="M11.1066 10.0057C11.1066 9.76546 11.1845 9.53166 11.3287 9.33942L17.9926 0.455223C18.0793 0.336583 18.1887 0.236333 18.3145 0.160283C18.4402 0.0842325 18.5798 0.0338942 18.7252 0.0121851C18.8705 -0.00952396 19.0188 -0.00217208 19.1613 0.0338144C19.3038 0.0698008 19.4377 0.133706 19.5553 0.221828C19.6729 0.309949 19.7719 0.420534 19.8464 0.547175C19.921 0.673815 19.9697 0.813992 19.9897 0.959584C20.0097 1.10517 20.0006 1.25328 19.9629 1.39533C19.9252 1.53738 19.8597 1.67053 19.7702 1.78709L13.3278 10.3756V16.669C13.3277 16.8751 13.2702 17.0772 13.1618 17.2525C13.0533 17.4278 12.8982 17.5695 12.7138 17.6617L8.27109 19.8829C8.10179 19.9675 7.91368 20.0074 7.72462 19.9989C7.53556 19.9903 7.35182 19.9337 7.19082 19.8342C7.02982 19.7347 6.89691 19.5958 6.8047 19.4305C6.7125 19.2652 6.66405 19.0792 6.66395 18.8899V10.3756L0.222108 1.78787C0.098352 1.62285 0.0229956 1.42664 0.00448283 1.22122C-0.0140299 1.0158 0.0250322 0.809276 0.117293 0.624801C0.209553 0.440325 0.351367 0.285183 0.526843 0.176758C0.702318 0.0683336 0.904523 0.0109101 1.1108 0.0109222H14.4386C14.7302 0.0153862 15.0083 0.134348 15.213 0.34212C15.4176 0.549892 15.5323 0.829803 15.5323 1.12141C15.5323 1.41302 15.4176 1.69294 15.213 1.90071C15.0083 2.10848 14.7302 2.22744 14.4386 2.23191H3.33201L8.66312 9.33942C8.80727 9.53166 8.88518 9.76546 8.88516 10.0057V17.0932L11.1066 15.9826V10.0057Z" />
  </svg>
)

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ... await serverSideTranslations(locale),
    },
  }
}
export default TradeHistory