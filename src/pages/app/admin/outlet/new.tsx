import React from 'react'
import LayoutAdmin from '../../../../components/LayoutAdmin';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../_app';

const OutletNew: NextPageWithLayout = () => {
  return (
    <div>New</div>
  )
}

export default OutletNew

OutletNew.getLayout = function getLayout(page: ReactElement) {
    return <LayoutAdmin>{page}</LayoutAdmin>;
  };
  