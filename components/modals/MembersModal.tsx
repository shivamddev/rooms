"use client";
import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";

import { useModalStore } from "@/hooks/useModalStore";

import { ServerWithMemberWithProfile } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import UserAvtarImage from "../UserAvtarImage";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useState } from "react";
import { memberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

const MembersModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModalStore();
  const [loadingId, setLoadingId] = useState("");
  const router = useRouter();
  const RoleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="size-4 ml-2 text-indigo-500" />,
    ADMIN: <ShieldCheck className="size-4 ml-2 text-rose-500" />,
  };
  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMemberWithProfile };

  const onRoleChange = async (memberId: string, role: memberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
          memberId,
        },
      });

      const response = await axios.patch(url, { role });

      router.refresh(); // use to update our server component
      onOpen("members", { server: response.data });
    } catch (err) {
      console.log(`error in on role change function==`, err);
    } finally {
      setLoadingId("");
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      console.log(`url==`, url);
      const response = await axios.delete(url);
      console.log(`response==`, response);
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (err) {
      console.log(`error in on kick function==`, err);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black  overflow-hidden">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl">
            Manage Members
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-zinc-500">
          {server?.members?.length} Members
        </DialogDescription>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member, index) => {
            return (
              <div key={index} className="flex mb-6 items-center gap-x-2">
                <UserAvtarImage src={member.profile.imageUrl} />
                <div className="flex flex-col gap-y-1">
                  <div className="text-xs font-semibold flex items-center">
                    {member.profile.name}
                    {RoleIconMap[member.role]}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {member.profile.email}
                  </p>
                </div>

                {server?.profileId !== member.profileId &&
                  loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="size-4 text-zinc-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="size-4 text-zinc-500 mr-2" />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member?.id, "GUEST")
                                  }
                                >
                                  <Shield className="mr-2 size-4" />
                                  Guest
                                  {member.role === "GUEST" && (
                                    <Check className="size-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member?.id, "MODERATOR")
                                  }
                                >
                                  <ShieldCheck className="mr-2 size-4" />
                                  Moderator
                                  {member.role === "MODERATOR" && (
                                    <Check className="size-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          {/*  */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onKick(member?.id)}>
                            <Gavel className="size-4" />
                            Kick
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                {loadingId === member.id && (
                  <Loader2 className="size-4 ml-auto text-zinc-500 animate-spin" />
                )}
              </div>
            );
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
export default MembersModal;
