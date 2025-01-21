"use client";

import { ServerWithMemberWithProfile } from "@/types";
import { channelType, memberRole } from "@prisma/client";
import ActionTooltip from "../ActionTooltip";
import { Plus, Settings } from "lucide-react";
import { useModalStore } from "@/hooks/useModalStore";

interface ServerSectionProps {
  label: string;
  role?: memberRole;
  channelType?: channelType;
  sectionType: "members" | "channels";
  server?: ServerWithMemberWithProfile;
}

const ServerSection = ({
  label,
  role,
  channelType,
  sectionType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModalStore();
  return (
    <div className="py-2 flex items-center justify-between">
      <p className="font-semibold uppercase text-xs text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== memberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel")}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="size-4" />
          </button>
        </ActionTooltip>
      )}

      {role === memberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="size-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
