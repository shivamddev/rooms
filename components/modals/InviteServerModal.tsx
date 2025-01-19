"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { useModalStore } from "@/hooks/useModalStore";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { UseOrigin } from "@/hooks/useOrigin";
import { useState } from "react";
import axios from "axios";

const InviteServerModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModalStore();
  const origin = UseOrigin();
  const isModalOpen = isOpen && type === "invite";
  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // console.log("inviteUrl", inviteUrl);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const onNew = async () => {
    // console.log("onNew===", server?.id);
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      onOpen("invite", { server: response?.data });
    } catch (err) {
      console.log(`error is `, err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 ">
          <Label
            className={`uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70`}
          >
            Server Invite Link
          </Label>

          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              readOnly
              value={inviteUrl}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
            />

            <Button disabled={isLoading} onClick={onCopy} size={"icon"}>
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            variant={"link"}
            size={"sm"}
            className="text-xs text-zinc-500 mt-4"
            onClick={onNew}
          >
            Generate a new link
            <RefreshCw className="ml-2 size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default InviteServerModal;
