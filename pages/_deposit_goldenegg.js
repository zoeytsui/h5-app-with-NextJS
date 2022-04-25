import React from 'react'
import Navbar from '../components/navbar'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next'


const Deposit = (props) => {
  return (
    <div className='container'>
      <Navbar head={{ name: '資金明細', link: '/' }} topRightText="儲存" />
      <div>deposit</div>
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
export default Deposit