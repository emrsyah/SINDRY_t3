import React from "react";
import SidebarAdmin from "./admin/SidebarAdmin";

interface Props {
  children: React.ReactNode;
}

const LayoutAdmin = ({ children }: Props) => {
  return (
    <div className="grid grid-cols-[252px_1fr] min-h-screen">
      <nav>
        <SidebarAdmin />
      </nav>
      <main className="m-8">{children}</main>
    </div>
  );
};

export default LayoutAdmin;
