import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import deposit_detail from '../public/images/deposit_details.png'

const Navbar = ({ head = { name: '', link: '' }, detail = '', topRightText = '', className = '' }) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <nav className={`nav align-items-center text-white py-4 ${className}`} style={{ borderRadius: '0 0 20px 20px' }}>
      <button className='btn text-white position-absolute start-0' onClick={() => { typeof head.link === 'function' ? head.link() : null }}>
        {/* <i className="bi bi-x-lg"></i> */}
        <i className="bi bi-chevron-left"></i>
      </button>

      <p style={{ fontSize: '18px', fontWeight: 400 }} className='mx-auto my-0'>{t(head.name)}</p>

      {typeof detail === 'function'
        ? <button className='btn position-absolute end-0' onClick={detail}>
          <Image src={deposit_detail} width={24} height={22} alt='' />
        </button>
        : ''
      }
      {topRightText !== ''
        ? <p style={{ fontSize: '16px', fontWeight: 400 }} className='mx-auto my-0'>{t(topRightText)}</p>
        : ''}
    </nav>
  )
}

export default Navbar