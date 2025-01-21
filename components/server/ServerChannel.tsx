"use client";

import { cn } from "@/lib/utils";
import { Channel, channelType, memberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "../ActionTooltip";
import { ModalType, useModalStore } from "@/hooks/useModalStore";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: memberRole;
}

const IconMap = {
  [channelType.TEXT]: Hash,
  [channelType.AUDIO]: Mic,
  [channelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModalStore();
  const router = useRouter();
  const params = useParams();

  const Icon = IconMap[channel.type];
  const onClick = () => {
    router.push(`/servers/${params?.id}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };
  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700 "
      )}
      onClick={onClick}
    >
      <Icon className="size-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400 " />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== memberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, "editChannel")}
              // onClick={() => onOpen("editChannel", { server, channel })}
              className=" hidden group-hover:block text-zinc-500 dark:text-zinc-600 size-4 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              // onClick={() => onOpen("deleteChannel", { server, channel })}
              onClick={(e) => onAction(e, "deleteChannel")}
              className=" hidden group-hover:block text-zinc-500 dark:text-zinc-600 size-4 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}

      {channel.name === "general" && (
        <Lock className="size-4 ml-auto text-zinc-500 dark:text-zinc-400 " />
      )}
    </button>
  );
};

export default ServerChannel;
