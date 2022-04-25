import { useTranslation } from "next-i18next"
import Image from "next/image"
import Lib from "../utils/_lib"
import fail_warning from '../public/images/fail_warning.svg'

const FailModal = ({ text }) => {
  const { t } = useTranslation()
  return (
    <div className="modal fade" id="FailModal" tabIndex="-1" aria-labelledby="FailModal" aria-hidden="true">
      <div className='modal-dialog modal-dialog-centered'>
        <style jsx>{`
          .modal-content {
            max-width: 267px;
            background: #FC8585;
            border-radius: 20px;
          }
          .modal-footer {
            border-radius: 0 0 20px 20px;
          }
          `}</style>
        <div className='modal-content mx-auto border-0'>
          <div className='modal-body p-0 my-5 d-flex flex-column justify-content-center'>
            <Image alt={t(text)} src={fail_warning} width={204} height={188} />
            <div className='btn my-3 fw-bold mx-auto text-white'>{t(text)}</div>
          </div>
          <div className='modal-footer border-0 bg-white'>
            {/* TODO: go somewhere */}
            <button className='btn text-primary mx-auto' data-bs-dismiss="modal" data-bs-target="#FailModal" onClick={() => Lib.pushView(11)}>{t('確定')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default FailModal