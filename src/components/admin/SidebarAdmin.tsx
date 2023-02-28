import Image from "next/image";
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const SidebarAdmin = () => {
  const {data: sessionData, status} = useSession()
  useEffect(()=>{
    console.log(sessionData)
    console.log(status)
  }, [sessionData, status])
  return (
    <nav className="flex h-full flex-col gap-4 border-r-[1.3px] bg-gray-50 p-6 pt-7">
      <div className="flex items-center gap-3">
        <Image
          src={
            "https://avatars.dicebear.com/api/adventurer-neutral/your-custom-seed.svg"
          }
          alt="profile"
          width={36}
          height={36}
          className="rounded-full"
        />
        <div className="">
          <h5 className="text-sm font-semibold">{sessionData?.user?.email}</h5>
          <p className="text-xs font-medium text-gray-400">{sessionData?.user?.role}</p>
        </div>
      </div>
        <button className="btn-primary  rounded-md">Buat Transaksi</button>
    </nav>
  );
};

export default SidebarAdmin;
