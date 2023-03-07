import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { useForm } from "react-hook-form";
import Link from "next/link";
import SindryIcon from "../components/SindryIcon";
import { useEffect } from "react";
import { useRouter } from "next/router";
import sindryLogo from '../../public/sindry-dos.svg'
import Image from "next/image";

type userProps = {
  email: string;
  password: string;
};

const Index: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;
    const role = sessionData.user?.role;
    if (role === "admin") {
      router.push("/app/admin/beranda");
    } else if (role === "owner") {
      router.push(`/app/owner/${sessionData.user?.outlet_id}/beranda`);
    } else if (role === "cashier") {
      router.push(`/app/cashier/${sessionData.user?.outlet_id}/beranda`);
    }
  }, [status]);
  // const {accessToken}  = sessionData
  // const data2 = trpc.auth.getSecretMessage.useQuery();
  // console.log(data2.isError);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userProps>();

  const signInHandler = handleSubmit(async (data) => {
    const email = data.email;
    const password = data.password;
    console.log(data);
    await signIn("credentials", {
      email,
      password,
      redirect: false
    });
  });

  return (
    <>
      <Head>
        <title>T3 Tauri App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid min-h-screen grid-cols-[40%_1fr] gap-12">
        <div className="m-8 flex flex-col">
          {/* <MenoosIcon /> */}
          <SindryIcon />
          <div className="my-10 flex flex-grow flex-col justify-center gap-3">
            <h3 className="raleway text-3xl font-extrabold">
              Selamat Datang Kembali
            </h3>
            <form
              onSubmit={signInHandler}
              // onChange={() => {
              //   if (isError) setIsError(false);
              // }}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-500">Email</p>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className={`input ${errors.email ? "border-red-500" : null} `}
                />
                {errors.email && (
                  <span className="text-xs font-medium text-red-500">
                    This field is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-500">Password</p>
                <input
                  type="password"
                  {...register("password", { required: true })}
                  className={`input ${
                    errors.password ? "border-red-500" : null
                  } `}
                />
                {errors.password && (
                  <span className="text-xs font-medium text-red-500">
                    This field is required
                  </span>
                )}
                {false && (
                  <span className="text-xs font-semibold text-red-500">
                    Email or password incorrect
                  </span>
                )}
              </div>
              <button className="btn-primary justify-center rounded-md text-base">
                Log In
              </button>
            </form>
            {/* <p className="mt-4 text-center text-sm font-medium">
              Don`t have an account?{" "}
              <Link
                href={"/signup"}
                className="highlight font-semibold hover:underline"
              >
                Sign up for free
              </Link>
            </p> */}
          </div>
        </div>
        <div className="bg-gray-800 bg-pattern flex items-center justify-center relative overflow-hidden">
          <div className="w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 opacity-80 absolute blur-3xl animate-[pulse_4s_ease-out_infinite]"></div>
          <Image alt="Sindry Logo" src={sindryLogo} width={120} height={120} className="animate-[bounce_5s_ease-out_infinite]" />
          <h5 className="absolute bottom-3 right-3 text-sm font-bold raleway text-white">Sistem Pengelolaan Laundry</h5>
        </div>
      </div>
    </>
  );
};

export default Index;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white px-10 py-3 text-xl font-bold text-black no-underline transition hover:bg-white/75"
        onClick={sessionData ? () => signOut() : () => signIn("credentials")}
      >
        {sessionData ? "Sign out" : "Sign in now"}
      </button>
    </div>
  );
};

{
  /* <main className="flex h-screen items-center justify-center">
<div className="flex flex-col items-center gap-2">
  <p className="text-2xl font-semibold text-white">
    {hello.data ? hello.data.greeting : "Loading tRPC query..."}
  </p>
<AuthShowcase /> 
  <form onSubmit={submitHandler}>
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold text-gray-500">Email</p>
      <input
        type="email"
        {...register("email", { required: true })}
        className="rounded border-[1.2px] border-gray-400 p-2 text-sm outline-none"
      />
      {errors.email && (
        <span className="text-xs font-medium text-red-500">
          This field is required
        </span>
      )}
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold text-gray-500">Password</p>
      <input
        type="password"
        {...register("password", { required: true })}
        className="rounded border-[1.2px] border-gray-400 p-2 text-sm outline-none"
      />
      {errors.password && (
        <span className="text-xs font-medium text-red-500">
          This field is required
        </span>
      )}
    </div>
  </form>
</div>
</main> */
}
