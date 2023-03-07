import React from "react";
import SidebarAdmin from "./SidebarAdmin";
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface Props {
  children: React.ReactNode;
}

const LayoutAdmin = ({ children }: Props) => {
  const {data, status} = useSession()
  const route = useRouter()

  useEffect(()=>{
    if(status === "unauthenticated"){
      route.replace("/")
    }
  }, [])

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
