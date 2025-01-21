"use client";

import { cn } from "@/lib/utils";
import { Member, memberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import UserAvtarImage from "../UserAvtarImage";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [memberRole.GUEST]: null,
  [memberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 size-4 text-indigo-500" />
  ),
  [memberRole.ADMIN]: <ShieldAlert className="ml-2 size-4 text-rose-500" />,
};

const ServerMember = ({ member, server }: ServerMemberProps) => {
  const router = useRouter();
  const params = useParams();

  const icon = roleIconMap[member.role];
  return (
    <button
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvtarImage
        src={member.profile.imageUrl}
        className="size-6 md:size-8"
      />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          params?.channelId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMember;
