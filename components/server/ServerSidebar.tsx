import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { channelType } from "@prisma/client";
import { Channel } from "diagnostics_channel";
import { redirect } from "next/navigation";

import React from "react";
import ServerHeader from "./ServerHeader";

interface ServerSidebarProps {
  serverId: string;
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  const textChannel = server?.channels?.filter((channel) => {
    return channel.type === channelType.TEXT;
  });
  const audioChannel = server?.channels?.filter((channel) => {
    return channel.type === channelType.AUDIO;
  });
  const videoChannel = server?.channels?.filter((channel) => {
    return channel.type === channelType.VIDEO;
  });

  //find all members excluding ourself
  const members = server?.members?.filter((member) => {
    return member?.profileId !== profile.id;
  });

  // find our role in that particular server
  const role = server?.members?.find((member) => {
    return member?.profileId === profile.id;
  })?.role;

  return (
    <div
      className={cn(
        "flex flex-col text-primary h-full dark:bg-[#2B2D31] bg-[#F2F3F5]"
      )}
    >
      <ServerHeader server={server}  role={role}/>
    </div>  
  );
};

export default ServerSidebar;
