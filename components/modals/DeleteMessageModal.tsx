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

import { useModalStore } from "@/hooks/useModalStore";

import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import {  useRouter } from "next/navigation";

const DeleteMessageModal = () => {
  const { type, isOpen, onClose, data } = useModalStore();

  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query } = data;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query: query,
      });
      const response = await axios.delete(url);
      onClose();
      
    } catch (err) {
      console.log(`error in on confirm function in delete channel modal==`, err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to delete this message?
            <br/>
            The message will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="px-6 py-4 bg-gray-100">
          <div className="w-full flex items-center justify-between">
            <Button disabled={isLoading} onClick={onClose} variant={"ghost"}>
              Cancel
            </Button>

            <Button
              disabled={isLoading}
              onClick={onConfirm}
              variant={"primary"}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteMessageModal;
