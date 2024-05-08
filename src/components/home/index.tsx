"use client";
/* eslint-disable @next/next/no-img-element */
import { useLogin, useLogout, usePrivy, useWallets } from "@privy-io/react-auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FarcasterIcon from "@/icons/farcaster";
import toast from "react-hot-toast";

export default function Hero() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { ready, authenticated, user, createWallet } = usePrivy();
  const { wallets } = useWallets();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const setProfile = async () => {
    const response = await fetch("/api/setCreator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user?.farcaster?.username,
        fid: user?.farcaster?.fid,
      }),
    });
    if (response.status === 200) {
      toast.success("User created successfully", {
        style: {
          borderRadius: "10px",
        },
      });
    }
  };

  const { login } = useLogin({
    async onComplete(user) {
      if (authenticated) {
        if (wallets.length === 0) {
          const res = createWallet();
        }
      }
      setIsLoggedIn(true);
      await setProfile();
      router.push(`/${user?.farcaster?.username}`);
    },
    onError(error) {
      console.log("🔑 🚨 Login error", { error });
    },
  });

  const { logout } = useLogout({
    onSuccess: () => {
      setIsLoggedIn(false);
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-20">
      <h1 className="text-[4rem] font-title font-semibold bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-violet-500/80">
        /DegenAsk.me
      </h1>
      {!isLoggedIn ? (
        <button
          className="flex w-fit gap-2 px-5 py-2 items-center font-primary text-neutral-100 bg-violet-500 hover:text-gray-50 hover:shadow-lg rounded-lg"
          onClick={login}
          disabled={!ready && authenticated}
        >
          <FarcasterIcon className="w-5 h-5" color="#ffffff" />
          Connect Farcaster
        </button>
      ) : (
        <div>
          <button
            className="block w-fit px-5 py-1.5 font-primary text-neutral-50 border border-teal-100 hover:border-amber-100 bg-gradient-to-tr from-orange-200 to-indigo-400  hover:text-gray-50 hover:shadow-lg rounded-lg"
            onClick={toggleDropdown}
          >
            <span className="flex flex-row items-center gap-x-4">
              <img src={user?.farcaster?.pfp!} alt="icon" className="w-10 h-10 rounded-full" />
              {user?.farcaster?.username}
            </span>
          </button>
          <div
            className={`${
              isDropdownOpen ? "block absolute" : "hidden"
            }  mt-1 z-10 divide-y divide-gray-100 rounded-lg shadow w-44 bg-neutral-900/95 font-primary`}
          >
            <ul className="py-2 text-sm text-gray-200" aria-labelledby="dropdown-button">
              <li>
                <button
                  type="button"
                  className="inline-flex w-full gap-2 items-center px-4 py-2 hover:bg-neutral-800/90 hover:text-teal-400"
                  onClick={async () => {
                    await navigator.clipboard.writeText(wallets[0]?.address);
                  }}
                >
                  Address:{" "}
                  <span className="text-[1rem] text-amber-400 text-ellipsis w-full font-medium">
                    {wallets[0]?.address.slice(0, 4)}...
                    {wallets[0]?.address.slice(-4)}
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-neutral-800/90 hover:text-teal-400"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}