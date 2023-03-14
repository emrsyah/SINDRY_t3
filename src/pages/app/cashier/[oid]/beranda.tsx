import type { ReactElement } from 'react';
import React from 'react'
import LayoutCashier from '../../../../components/cashier/LayoutCashier';

const Beranda = () => {
  return (
    <div>beranda kasir</div>
  )
}

export default Beranda

Beranda.getLayout = function getLayout(page: ReactElement) {
  return <LayoutCashier>{page}</LayoutCashier>;
};
