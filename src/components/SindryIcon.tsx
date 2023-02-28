import Image from "next/image";
import React from "react";
import sindryIcon from "../../public/sindryLogos.svg";
import Link from "next/link";


const SindryIcon: React.FC = () => {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <Image alt="App Showcase" src={sindryIcon} height={32} width={32} />
      <h5 className="raleway  text-2xl font-extrabold text-sky-500">Sindry</h5>
    </Link>
  );
};

export default SindryIcon;
