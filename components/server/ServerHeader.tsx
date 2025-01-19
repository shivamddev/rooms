"use client";

import { ServerWithMemberWithProfile } from "@/types";
import { memberRole } from "@prisma/client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModalStore } from "@/hooks/useModalStore";

interface ServerHeaderProps {
  server: ServerWithMemberWithProfile;
  role?: memberRole;
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModalStore();
  const isAdmin = role === memberRole.ADMIN;
  const isModerator = isAdmin || role === memberRole.MODERATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <button
          className="w-full text-md font-semibold px-3 flex items-center 
         border-neutral-200 h-12 border-b-2 dark:border-neutral-800 
         hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition
         "
        >
          {server?.name}
          <ChevronDown className="size-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black  dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server: server })}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
          onClick={()=>onOpen("editServer", {server})}
          className=" px-3 py-2 text-sm cursor-pointer">
            Server Settings
            <Settings className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className=" px-3 py-2 text-sm cursor-pointer">
            Manage Members
            <Users className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className=" px-3 py-2 text-sm cursor-pointer">
            Create Channel
            <PlusCircle className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
            Delete Server
            <Trash className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
            Leave Server
            <LogOut className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
