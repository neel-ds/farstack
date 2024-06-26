/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Button from "@/components/form/button";
import { useAtomValue, useSetAtom } from "jotai";
import { authAtom, authMethodAtom, degenPrice, headshotAtom, userAtom } from "@/store";
import { FaRegEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Account() {
  const user = useAtomValue(userAtom);
  const headshotData = useAtomValue(headshotAtom);
  const degenPriceUsd = useAtomValue(degenPrice);
  const { fees, username: creatorUsername, feeAddress } = user;
  const { name } = headshotData;
  const setAuth = useSetAtom(authAtom);
  const setAuthMethod = useSetAtom(authMethodAtom);
  const router = useRouter();

  return (
    <div className="flex flex-col w-full md:w-3/5 gap-5 font-primary">
      <span className="flex flex-row w-full items-center justify-between">
        <h3 className="text-xl text-neutral-500">{name}&apos;s Degenask</h3>
        <button
          className="flex flex-row gap-2 w-fit text-violet-500 hover:text-violet-600 items-center justify-center font-medium"
          onClick={() => {
            setAuth("setup");
            setAuthMethod("edit");
            router.push(`/setup/${creatorUsername}`);
          }}
        >
          <FaRegEdit /> Edit account
        </button>
      </span>
      <div className="flex flex-col gap-2">
        <span className="bg-[#F6F6F6] text-lg p-4 font-medium rounded-xl truncate">
          <p className="text-neutral-500 text-md font-regular">Address to receive Funds</p>
          {feeAddress}
        </span>
        <span className="bg-[#F6F6F6] text-lg p-4 font-medium rounded-xl">
          <p className="text-neutral-500 text-md font-regular">Price to Ask</p>
          <span className="flex flex-row items-center justify-between">
            {fees} DEGEN
            <p className="text-neutral-400">{(fees * degenPriceUsd).toFixed(2)} USD</p>
          </span>
        </span>
        <p className="text-sm text-neutral-500">
          {" "}
          <b className="font-medium text-violet-400">NOTE:</b> Reminder to answer questions within 2
          days otherwise it will expire.
        </p>
      </div>
      <Button
        id="share"
        title="Share the Page"
        onClick={() => {
          window.open(
            `https://warpcast.com/~/compose?text=Ask%20me%20anything%20on%20degenask.me/${creatorUsername}%20and%20earn%20$DEGEN%20for%20your%20questions`,
            "_blank",
          );
        }}
      />
    </div>
  );
}
