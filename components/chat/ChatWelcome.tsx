import { Hash } from "lucide-react";
import React from "react";
interface ChatWelcomeProps {
  type: "channel" | "conversation";
  name: string;
}
const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  return (
    <div className="px-4 pb-4 space-y-2 ">
      {type === "channel" && (
        <div className="size-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
          <Hash className="text-white size-12" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? `Welcome to #` : ``}
        {name}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {type === "channel"
          ? `This is the start of the ${name} channel.`
          : `This is a start of your conversation with ${name}.`}
      </p>
    </div>
  );
};

export default ChatWelcome;
