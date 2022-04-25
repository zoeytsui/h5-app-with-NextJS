import { useTranslation } from "next-i18next"
import Image from "next/image"
import norecordICON from '../public/images/norecordICON.png'
const NoData = () => {
  const { t } = useTranslation()
  return (
    <div className='text-center my-3'>
      <Image src={norecordICON} width={46} height={42} alt={t('暫無紀錄')} />
      <div className='fs-5'>{t('暫無紀錄')}</div>
    </div>
  )
}
export default NoData