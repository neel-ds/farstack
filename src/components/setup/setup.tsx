import { useEffect, useState } from "react";
import Input from "../form/input";
import Button from "../form/button";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import dynamic from "next/dynamic";
import { DegenAskABI, DegenAskContract } from "@/utils/constants";
import { parseEther } from "viem";
import toast from "react-hot-toast";
import type { User } from "@/types";
import { authMethodAtom, userAtom } from "@/store";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { updateCreator } from "@/app/_actions/queries";
import { FiAlertCircle } from "react-icons/fi";
import { PiMoneyWavy } from "react-icons/pi";

const Connect = dynamic(() => import("@/components/shared/connect"), {
  ssr: false,
});

export default function SetProfile({ user }: { user: User }) {
  const { username, address: savedAddress, price, count } = user;
  const [fees, setFees] = useState<number>();
  const { address, chainId } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setUser = useSetAtom(userAtom);
  const router = useRouter();
  const authMethod = useAtomValue(authMethodAtom);
  const { user: fcUser } = usePrivy();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const { data, writeContractAsync, status } = useWriteContract();
  const {
    isSuccess,
    status: isValid,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

  useEffect(() => {
    setFees(price);
  }, [price]);

  const setProfile = () => {
    if (price > 0) {
      writeContractAsync({
        account: address,
        address: DegenAskContract,
        abi: DegenAskABI,
        functionName: "editCreatorFee",
        args: [parseEther(String(fees))],
      }).catch((error) => {
        setIsLoading(false);
        toast.error("User rejected the request", {
          style: {
            borderRadius: "10px",
          },
        });
      });
    } else {
      writeContractAsync({
        account: address,
        address: DegenAskContract,
        abi: DegenAskABI,
        functionName: "createCreator",
        args: [parseEther(String(fees))],
      }).catch((error) => {
        setIsLoading(false);
        toast.error("User rejected the request", {
          style: {
            borderRadius: "10px",
          },
        });
      });
    }
  };

  const store = async () => {
    const response = await updateCreator(username, String(address), fees!);
    if (response.status === 204) {
      toast.success("Saved successfully", {
        style: {
          borderRadius: "10px",
        },
      });
      setUser({
        username,
        address: String(address),
        price: fees ?? 0,
        count,
        degen: user.degen,
      });
    }
    setIsLoading(false);
    router.push(`/${user.username}`);
  };

  useEffect(() => {
    if (status === "success" && isSuccess && isValid === "success") {
      store();
    } else if (isTxError) {
      setIsLoading(false);
      toast.error("Something went wrong", {
        style: {
          borderRadius: "10px",
        },
      });
    }
  }, [status, isSuccess, isValid, isTxError]);

  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  return (
    <div className="flex flex-col w-full md:w-3/5 gap-5 items-start justify-start font-primary">
      <h2 className="text-xl text-neutral-500">Setup Profile</h2>
      <Input
        id="price"
        name="price"
        label="Price to ask"
        placeholder="250"
        type="number"
        onChange={(e) => {
          setFees(e.target.value);
        }}
        value={fees}
        helper="Asker will pay you this amount to ask question"
        suffix={`DEGEN ${fees ? `(${(fees * user.degen).toFixed(2)} USD)` : ``}`}
      />
      {/* TODO: Show this as tooltip onHover of info icon, it can be place beside the Setup profile title */}
      {/* <span className="flex flex-row gap-2 text-sm items-start justify-start p-2 bg-violet-400 bg-opacity-20 border border-violet-400 text-neutral-500 rounded-xl">
        <PiMoneyWavy size={25} color="#8b5cf6" /> For a smooth and well-maintained experience, we apply a 20% service fee to cover maintenance costs.
      </span> */}
      {authMethod === "initial" && (
        <span className="flex flex-row gap-2 text-sm items-start justify-start p-2 bg-yellow-400 bg-opacity-25 border border-amber-400 text-neutral-500 rounded-xl">
          <FiAlertCircle size={20} color="#d97706" /> NOTE: You won&apos;t be able to change wallet
          address again. Please use your account accordingly.
        </span>
      )}
      <div className="flex flex-row gap-4 items-start">
        {isPageLoading ? (
          <Button id="setPrice" title={authMethod === "initial" ? "Create a Page" : "Save price"} />
        ) : address && chainId === Number(process.env.NEXT_PUBLIC_CHAINID) ? (
          <Button
            id="setPrice"
            title={
              authMethod === "initial"
                ? isLoading
                  ? "Creating page..."
                  : "Create a Page"
                : isLoading
                  ? "Saving..."
                  : "Save price"
            }
            disabled={isLoading || !fees}
            onClick={() => {
              if (user.username === fcUser?.farcaster?.username) {
                if (user.address) {
                  if (user.address === address) {
                    setIsLoading(true);
                    setProfile();
                  } else {
                    toast.error("Please connect your initial signed account", {
                      style: {
                        borderRadius: "10px",
                      },
                    });
                  }
                } else {
                  setIsLoading(true);
                  setProfile();
                }
              } else {
                toast.error("You are not authorized to set price", {
                  style: {
                    borderRadius: "10px",
                  },
                });
              }
            }}
          />
        ) : (
          <Connect label={`${authMethod === "initial" ? "Create a Page" : "Save price"}`} />
        )}
        {authMethod === "edit" && (
          <button
            id="cancel"
            onClick={() => {
              router.push(`/${user.username}`);
            }}
            className="font-medium font-primary border border-[#A36EFD] hover:bg-[#9a61fc] hover:shadow-lg hover:text-white text-sm md:text-md lg:text-lg py-[0.575rem] px-10 rounded-3xl w-fit"
          >
            Go back
          </button>
        )}
      </div>
    </div>
  );
}
