import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { UilExclamationTriangle, UilTimes } from "@iconscout/react-unicons";
import { trpc } from "../utils/trpc";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function DeleteConfirmationModal({
  id,
  isOpen,
  setIsOpen,
  type,
}: {
  id: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
}) {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const {oid} = router.query

  // * Delete Mutation
  const deleteOutlet = trpc.outlet.delete.useMutation({
    onSuccess: () => {
      const basePath = `/app/${sessionData?.user?.role}`;
      toast.info("Berhasil Menghapus Data", { autoClose: 1000 });
      router.push(`/${basePath}/${oid}/${type}`);
    },
    onError: () => {
      toast.error("Gagal Menghapus Data", { autoClose: 1000 });
    },
  });

  const deleteCustomer = trpc.customer.delete.useMutation({
    onSuccess: () => {
      const basePath = `/app/${sessionData?.user?.role}`;
      toast.info("Berhasil Menghapus Data", { autoClose: 1000 });
      router.push(`/${basePath}/${oid}/${type}`);
    },
    onError: () => {
      toast.error("Gagal Menghapus Data", { autoClose: 1000 });
    },
  });

  const deleteProduct = trpc.product.delete.useMutation({
    onSuccess: () => {
      const basePath = `/app/${sessionData?.user?.role}`;
      toast.info("Berhasil Menghapus Data", { autoClose: 1000 });
      router.push(`/${basePath}/${oid}/${type}`);
    },
    onError: () => {
      toast.error("Gagal Menghapus Data", { autoClose: 1000 });
    },
  });

  const deleteTransaction = trpc.transaction.delete.useMutation({
    onSuccess: () => {
      const basePath = `/app/${sessionData?.user?.role}`;
      toast.info("Berhasil Menghapus Data", { autoClose: 1000 });
      router.push(`/${basePath}/${oid}/${type}`);
    },
    onError: () => {
      toast.error("Gagal Menghapus Data", { autoClose: 1000 });
    },
  });

  const deleteUser = trpc.user.delete.useMutation({
    onSuccess: () => {
      const basePath = `/app/${sessionData?.user?.role}`;
      toast.info("Berhasil Menghapus Data", { autoClose: 1000 });
      router.push(`/${basePath}/${oid}/${type}`);
    },
    onError: () => {
      toast.error("Gagal Menghapus Data", { autoClose: 1000 });
    },
  });

  // * Delete Button Handler
  const deleteHandler = async () => {
    if (type === "outlet") {
      deleteOutlet.mutate({
        id: id,
      });
    } else if (type === "pelanggan") {
      deleteCustomer.mutate({
        id: id,
      });
    } else if (type === "produk") {
      deleteProduct.mutate({
        id: id,
      });
    } else if (type === "orderan") {
      deleteTransaction.mutate({
        id: id,
      });
    } else if (type === "pengguna") {
      const strId = id.toString();
      deleteUser.mutate({
        id: strId,
      });
    }
  };

  const cancelHandler = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={cancelHandler} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="mx-auto w-[650px] max-w-sm rounded bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="flex items-center gap-2 font-semibold">
              <div className="rounded-full bg-red-100 p-1 text-red-600">
                <UilExclamationTriangle size="20" />
              </div>
              <p>Konfirmasi Penghapusan</p>
            </Dialog.Title>
            <button onClick={cancelHandler}>
              <UilTimes size="20" />
            </button>
          </div>
          <div className="mt-2 mb-5">
            <p className="font-medium tracking-wide text-gray-600">
              Apa anda yakin ingin menghapus {type} ini?
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={cancelHandler}
              className="btn-base rounded border-[1px] border-gray-400 font-semibold text-gray-800 hover:bg-gray-100"
            >
              Batalkan
            </button>
            <button
              onClick={deleteHandler}
              className="btn-base rounded bg-red-600 text-white hover:bg-red-700"
            >
              Konfirmasi
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default DeleteConfirmationModal;
