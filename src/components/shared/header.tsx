/* eslint-disable @next/next/no-img-element */
import { setCreator } from "@/app/_actions/queries";
import FarcasterIcon from "@/icons/farcaster";
import { authAtom, authMethodAtom } from "@/store";
import { User } from "@/types";
import { useLogin, useLogout, usePrivy, useWallets } from "@privy-io/react-auth";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Header({ users }: { users: User[] }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();
  const { ready, authenticated, user, createWallet } = usePrivy();
  const setAuth = useSetAtom(authAtom);
  const setAuthMethod = useSetAtom(authMethodAtom);
  const { wallets } = useWallets();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
  const { logout } = useLogout({
    onSuccess: () => {
      setIsLoggedIn(false);
      setIsDropdownOpen(false);
    },
  });

  const setProfile = async () => {
    const response = await setCreator(user?.farcaster?.username!);
    if (response.status === 201) {
      toast.success("User created successfully", {
        style: {
          borderRadius: "10px",
        },
      });
      setAuth("setup");
      setAuthMethod("initial");
      router.push(`/setup/${user?.farcaster?.username}`);
      return;
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
      if (user) {
        const isExist = users.find(
          (profile: User) => profile.username === user?.farcaster?.username,
        );
        if (isExist) {
          return;
        }
      }
      await setProfile();
    },
    onError(error) {
      toast.error("Encountered with login error, try again!", {
        style: {
          borderRadius: "10px",
        },
      });
      console.log("🚨 Login error", { error });
    },
  });

  return (
    <div className="absolute w-full grid grid-row-[0fr_1fr_1fr] gap-y-4 sm:grid-cols-[0.8fr_2fr_1fr] md:grid-cols-[1fr_2.5fr_1fr] lg:grid-cols-[1fr_3fr_1fr] xl:grid-cols-[2.2fr_8fr_2fr] mt-14 items-center justify-center">
      <span className="hidden sm:visible sm:flex"></span>
      <span className="flex flex-row gap-2 items-center justify-center">
        <img src="/degenask.png" className="w-6 h-6 object-cover" alt="logo" />
        <p className="text-[#A36EFD] md:text-xl lg:text-2xl font-title">degenask.me</p>
      </span>
      {isLoggedIn ? (
        <div
          className="relative flex flex-row px-6 py-3 w-fit justify-center items-center font-bold gap-3 text-neutral-700 bg-white hover:cursor-pointer rounded-xl"
          onClick={toggleDropdown}
        >
          <img
            src={user?.farcaster?.pfp!}
            alt="icon"
            className="w-7 h-7 rounded-full object-cover"
          />
          {user?.farcaster?.username}
          <div
            className={`${
              isDropdownOpen ? "block absolute" : "hidden"
            }  mt-28 z-10 divide-y divide-gray-100 rounded-lg shadow w-40 bg-neutral-50 font-primary`}
          >
            <ul className="py-1 text-sm text-neutral-700" aria-labelledby="dropdown-button">
              <li>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-neutral-100 hover:text-neutral-800"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          className="flex my-5 w-fit gap-3 px-6 py-3 items-center font-primary text-neutral-700 bg-white hover:shadow-lg rounded-xl"
          onClick={login}
          disabled={!ready && authenticated}
        >
          <FarcasterIcon className="w-5 h-5" color="#A36EFD" />
          Sign in
        </button>
      )}
    </div>
  );
}
