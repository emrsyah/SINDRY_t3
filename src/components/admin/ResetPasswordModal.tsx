import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { UilKeyholeCircle, UilTimes } from "@iconscout/react-unicons";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import sha1 from "sha1";
import { trpc } from "../../utils/trpc";

function ResetPasswordModal({
  id,
  isOpen,
  setIsOpen,
}: {
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const resetPassword = trpc.user.resetPassword.useMutation({
    onSuccess: () => {
      toast.info("Berhasil Mereset Password", { autoClose: 1000 });
      setPassword("")
      setIsOpen(false)
    },
    onError: () => {
      toast.error("Gagal Mereset Password", { autoClose: 1000 });
    },
  });

  const cancelHandler = () => {
    setIsOpen(false);
  };

  const submitHandler = (ev) => {
    ev.preventDefault();
    const newPass = sha1(password.replace(/^\s+|\s+$/gm, ""));
    resetPassword.mutate({
      id: id,
      password: newPass
    })
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
              <div className="rounded-full bg-indigo-100 p-1 text-indigo-600">
                <UilKeyholeCircle size="20" />
              </div>
              <p>Reset Password</p>
            </Dialog.Title>
            <button onClick={cancelHandler}>
              <UilTimes size="20" />
            </button>
          </div>
          <form onSubmit={submitHandler}>
            <div className="mt-2 mb-4 flex">
              <input
                type="password"
                className="input flex-grow"
                placeholder="Password Baru"
                required
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                min={8}
                max={15}
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={cancelHandler}
                className="btn-base rounded border-[1px] border-gray-400 font-semibold text-gray-800 hover:bg-gray-100"
              >
                Batalkan
              </button>
              <button
                // onClick={deleteHandler}
                className="btn-base btn-primary rounded"
              >
                Konfirmasi
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ResetPasswordModal;
