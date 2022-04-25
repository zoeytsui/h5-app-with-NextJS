import { useTranslation } from "next-i18next"
import Image from "next/image"
import Lib from "../utils/_lib"
import success_register from '../public/images/success_register.svg'

const SuccessModal = ({ text }) => {
  const { t } = useTranslation()
  return (
    <div className="modal fade" id="SuccessModal" tabIndex="-1" aria-labelledby="SuccessModal" aria-hidden="true">
      <div className='modal-dialog modal-dialog-centered'>
        <style jsx>{`
          .modal-content {
            max-width: 267px;
            background:#45C794;
            border-radius: 20px;
          }
          .modal-footer {
            border-radius: 0 0 20px 20px;
          }
          `}</style>
        <div className='modal-content mx-auto border-0'>
          <div className='modal-body mx-auto mt-5 d-flex flex-column justify-content-center'>
            <Image alt={t(text)} src={success_register} width={204} height={188} />
            <h6 className='my-3 fw-bold mx-auto text-white'>{t(text)}</h6>
          </div>
          <div className='modal-footer border-0 bg-white'>
            <button className='btn text-primary mx-auto' data-bs-dismiss="modal" onClick={() => Lib.pushView(4)}>{t('確定')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SuccessModal