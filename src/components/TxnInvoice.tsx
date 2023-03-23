import html2pdf from "html2pdf.js/dist/html2pdf.min";
import ReactDOMServer from "react-dom/server";
import rupiahConverter from "../helpers/rupiahConverter";
import { UilPrint } from "@iconscout/react-unicons";
import type { RouterOutputs } from "../utils/trpc";
import dayjs from 'dayjs';

const Icon = () => (
  <svg
    width="65"
    height="65"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="100" height="100" rx="16" fill="url(#paint0_linear_512_97)" />
    <rect
      x="58.7026"
      y="33"
      width="27"
      height="55"
      rx="6"
      transform="rotate(44.7232 58.7026 33)"
      fill="#D9D9D9"
      fill-opacity="0.5"
    />
    <rect
      x="60.7026"
      y="8"
      width="27"
      height="55"
      rx="6"
      transform="rotate(44.7232 60.7026 8)"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_512_97"
        x1="-1.86265e-07"
        y1="5"
        x2="100"
        y2="100"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#4C51BF" />
        <stop offset="1" stop-color="#4CBFB1" />
      </linearGradient>
    </defs>
  </svg>
);

type TxnProps = RouterOutputs["transaction"]["getById"];
function TxnInvoice({ transaction }: { transaction: TxnProps }) {
  const fromData = [
    {
      label: "Nama Outlet",
      value: transaction?.outlets.name,
    },
    {
      label: "Nama Kasir",
      value: transaction?.user.name,
    },
    {
      label: "Tanggal Pemesanan",
    //   value: "12 Maret 2023",
      value:  dayjs(transaction?.created_at).format("DD MMM YYYY"),
    },
    {
      label: "Kode Pesanan",
      value: transaction?.invoice_code,
    },
    {
      label: "Dicetak Pada Tanggal",
    //   value: "15 Maret 2023 - 22:25:00",
      value: dayjs().format("DD MMM YYYY - HH:mm:ss"),
    },
  ];

  const finalData = [
    {
      label: "Sub-Total",
      value: transaction?.sub_total,
    },
    {
      label: "Diskon",
      value: transaction?.discount,
    },
    {
      label: "Pajak",
      value: transaction?.taxes,
    },
    {
      label: "Biaya Tambahan",
      value: transaction?.additional_cost,
    },
    {
      label: "Total Akhir",
      value: transaction?.total,
    },
  ];
  const PdfJSX = () => {
    return (
      <div className="flex flex-col border-2 p-8">
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            {/* <img src={"https://i.postimg.cc/tT4hksr4/sindry-new-icon.png"} alt="" className='w-16 h-16' /> */}
            <div className="h-16 w-16">
              <Icon />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold">Sindry</h3>
              <h5>{transaction?.invoice_code}</h5>
            </div>
          </div>
          <div className="my-8 h-[1px] w-full border-b-[1.5px] border-dotted border-gray-400 bg-transparent"></div>
          <div className="flex flex-col gap-3 text-lg">
            {fromData.map((d, i) => (
              <div className="grid grid-cols-5" key={i}>
                <div className="col-span-2 font-medium text-gray-500">
                  {d.label}
                </div>
                <div className="col-span-3 text-end font-semibold">
                  {d.value}
                </div>
              </div>
            ))}
          </div>
          <div className="my-8 h-[1px] w-full border-b-[1.5px] border-dotted border-gray-400 bg-transparent"></div>
          <div className="flex flex-col gap-3 text-lg">
            <div className="grid grid-cols-9 font-medium text-gray-500">
              <div className="col-span-4">Product</div>
              <div className="col-span-1 text-center">Qty</div>
              <div className="col-span-2 text-end">Price</div>
              <div className="col-span-2 text-end">Total</div>
            </div>
            {transaction?.transaction_details.map((d, i) => (
              <div className="grid grid-cols-9 font-medium" key={i}>
                <div className="col-span-4">{d.products.name}</div>
                <div className="col-span-1 text-center">{d.quantity}</div>
                <div className="col-span-2 text-end">
                  {rupiahConverter(d.products.price)}
                </div>
                <div className="col-span-2 text-end">
                  {rupiahConverter(d.products.price * d.quantity)}
                </div>
              </div>
            ))}
          </div>
          <div className="my-8 h-[1px] w-full border-b-[1.5px] border-dotted border-gray-400 bg-transparent"></div>
          <div className="flex flex-col gap-3 text-lg">
            {finalData.map((d, i) => (
              <div className="grid grid-cols-5" key={i}>
                <div className="col-span-2 font-medium text-gray-500">
                  {d.label}
                </div>
                <div className="col-span-3 text-end font-semibold">
                  {d.label === "Diskon" || d.label === "Pajak"
                    ? `${d.value}%`
                    : `${rupiahConverter(d.value)}`}
                </div>
              </div>
            ))}
          </div>
          <div className="my-8 h-[1px] w-full border-b-[1.5px] border-dotted border-gray-400 bg-transparent"></div>
        </div>
        <div className="flex items-center justify-center text-lg font-semibold">
          Dicetak dari Sindry 1.0
        </div>
      </div>
    );
  };

  const printHandler = () => {
    const printElement = ReactDOMServer.renderToString(PdfJSX());
    html2pdf().from(printElement).save();
  };

  return (
    <button onClick={printHandler} className="flex gap-2">
      {/* <PdfJSX /> */}
      <UilPrint size="18" />
      <p className="font-medium">Cetak Struk</p>
    </button>
  );
}

export default TxnInvoice;
