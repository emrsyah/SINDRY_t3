import React from "react";
import LayoutAdmin from "../../../components/LayoutAdmin";
import { NextPageWithLayout } from "../../_app";
import { ReactElement } from "react";

const Beranda: NextPageWithLayout = () => {
  return <div>Berandaz</div>;
};

export default Beranda;

Beranda.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAdmin>
      {page}
    </LayoutAdmin>
  );
};
