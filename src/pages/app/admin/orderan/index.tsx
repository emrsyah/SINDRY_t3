import React from 'react'
import LayoutAdmin from '../../../../components/LayoutAdmin';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../../../_app';

const Index: NextPageWithLayout = () => {
  return (
    <div>Index Orderan</div>
  )
}

export default Index

Index.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAdmin>
        {page}
      </LayoutAdmin>
    );
  };