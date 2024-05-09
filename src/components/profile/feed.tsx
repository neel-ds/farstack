import React from "react";
import type { Profile } from "@/types";

export default function Feed({ user }: Profile) {
  return (
    <div>
      <div className="flex-col max-h-[20rem] overflow-y-scroll scroll-m-2 scrollbar">
        <div className="bg-[#F6F8FA] p-2 rounded-md flex-col mb-4">
          <div className="mb-4">
            How and What Resources you will suggest to build on Farcaster? What are your top
            recommended FC users i should follow to learn more?
          </div>
          <div className="flex gap-2 items-center mb-4">
            <div>asked by</div>
            <div>{user?.username}</div>
          </div>
          <div>Replied</div>
        </div>
        <div className="bg-[#F6F8FA] p-2 rounded-md flex-col mb-4">
          <div className="mb-4">
            How and What Resources you will suggest to build on Farcaster? What are your top
            recommended FC users i should follow to learn more?
          </div>
          <div className="flex gap-2 items-center mb-4">
            <div>asked by</div>
            <div>{user?.username}</div>
          </div>
          <div>
            <button>Answer</button>
          </div>
        </div>
        <div className="bg-[#F6F8FA] p-2 rounded-md flex-col mb-4">
          <div className="mb-4">
            How and What Resources you will suggest to build on Farcaster? What are your top
            recommended FC users i should follow to learn more?
          </div>
          <div className="flex gap-2 items-center mb-4">
            <div>asked by</div>
            <div>{user?.username}</div>
          </div>
          <div>
            <button>Answer</button>
          </div>
        </div>
        <div className="bg-[#F6F8FA] p-2 rounded-md flex-col mb-4">
          <div className="mb-4">
            How and What Resources you will suggest to build on Farcaster? What are your top
            recommended FC users i should follow to learn more?
          </div>
          <div className="flex gap-2 items-center mb-4">
            <div>asked by</div>
            <div>{user?.username}</div>
          </div>
          <div>
            <button>Answer</button>
          </div>
        </div>
      </div>
    </div>
  );
}
