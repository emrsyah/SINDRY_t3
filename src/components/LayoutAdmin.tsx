import { NextPage } from "next";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const LayoutAdmin = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default LayoutAdmin;
