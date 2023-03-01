import React from 'react'
import LayoutAdmin from '../../../../components/LayoutAdmin';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../_app';

const Index: NextPageWithLayout = () => {
  return (
    <div>Index Produk</div>
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