"use client";
import { useState } from "react";
import TextArea from "@/components/form/textarea";
import Button from "@/components/form/button";
import { IoMdArrowBack } from "react-icons/io";
import { useAtomValue, useSetAtom } from "jotai";
import { feedAtom } from "@/store";

interface IAskQuestionProps {
  price: number;
}

export default function AskQuestion({ price }: IAskQuestionProps) {
  const [questionContent, setQuestionContent] = useState<string>();
  const feed = useAtomValue(feedAtom);
  const setFeed = useSetAtom(feedAtom);

  const handleBack = () => {
    setFeed("feed");
  };

  return (
    <div>
      <div
        onClick={handleBack}
        className="cursor-pointer items-center inline-flex text-sm text-neutral-700 gap-2"
      >
        <IoMdArrowBack size={25} />
        <div>Go Back</div>
      </div>
      <div className="mb-5">
        <TextArea
          id="content"
          name="content"
          label="Ask a question"
          placeholder="Degen IRL party wen?"
          value={questionContent}
          onChange={(e) => setQuestionContent(e.target.value)}
        />
      </div>
      <div>
        <Button id="button" title={`Pay ${price} DEGEN`} />
      </div>
    </div>
  );
}
