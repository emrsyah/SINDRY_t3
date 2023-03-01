export interface Outlet {
  id: number;
  name: string;
  address: string;
  contact: string;
  total_sales: number;
  created_at: Date;
}

export type OutletListType = Outlet[];
export interface Customer {
  id: number;
  name: string;
  address: string;
  gender: "L" | "P";
  contact: string;
  outlet_id: number;
  created_at: Date;
}

export type CustomerListType = Customer[];

export interface Product {
  id: number;
  outlet_id: number;
  type: string;
  name: string;
  price: number;
  created_at: Date;
  outlet_name: string;
  sold: number,
}

export type ProductListType = Product[];

export interface Transaction {
  id: number;
  customer_id: number;
  created_at: Date;
  total: number;
  sub_total: number;
  cashier_id: number;
  invoice_code: string;
  outlet_id: number;
  additional_cost: number;
  discount: number;
  taxes: number;
  status: "new" | "on_process" | "finished" | "picked_up";
  is_paid: number;
  deadline: Date;
  paid_at: Date;
  outlet_name: string;
  cashier_name: string;
}

export interface TransactionWithCustomer extends Transaction {
  customer_name: string;
  customer_address: string;
  customer_contact: string;
}

export type TransactionListType = Transaction[];

export interface TransactionDetail {
  id: number;
  transaction_id: number;
  product_id: number;
  quantity: number;
  description: string;
  name: string;
  price: number;
  total?: number;
}

export type TransactionDetailType = TransactionDetail[]

export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  outlet_id: number;
  role: "admin" | "cashier" | "owner";
  created_at: Date;
  outlet_name: string;
}

export type UserListType = User[]


export interface Role {
  label: "Admin" | "Kasir" | "Pemilik";
  value: "admin" | "cashier" | "owner";
}

export const roleOptions: Role[] = [
  { label: "Admin", value: "admin" },
  { label: "Kasir", value: "cashier" },
  { label: "Pemilik", value: "owner" },
];



export interface Gender {
  label: "Laki-laki" | "Perempuan";
  value: "L" | "P";
}

export const genderOptions: Gender[] = [
  { label: "Laki-laki", value: "L" },
  { label: "Perempuan", value: "P" },
];


export interface ProductType {
  label: "Kiloan" | "Selimut" | "Kaos" | "Bed Cover" | "Lainnya";
  value: "kiloan" | "selimut" | "kaos" | "bed_cover" | "lainnya";
}

export const productTypeOptions: ProductType[] = [
  {
    label: "Kiloan",
    value: "kiloan"
  },
  {
    label: "Selimut",
    value: "selimut"
  },
  {
    label: "Kaos",
    value: "kaos"
  },
  {
    label: "Bed Cover",
    value: "bed_cover"
  },
  {
    label: "Lainnya",
    value: "lainnya"
  },
]