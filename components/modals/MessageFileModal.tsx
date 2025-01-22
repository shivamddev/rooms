"use client";
import * as z from "zod";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import FileUpload from "../common/FileUpload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/hooks/useModalStore";
const MessageFileModal = () => {
  const { isOpen, onClose, data, type } = useModalStore();
  const { apiUrl, query } = data;
  const isModalOpen = isOpen && type === "messageFile";
  const router = useRouter();
  const formSchema = z.object({
    // name: z.string().min(1, {
    //   message: "Server Name is required",
    // }),
    fileUrl: z.string().min(1, {
      message: "Attachment is required",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // name: "",
      fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(`inside on submit`)
    console.log(`values orign me bhai == `, values);
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query: query,
      });
      const request = await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });
      console.log(`request == `, request);

      router.refresh();
      handleClose();
    } catch (error) {
      console.log(`error == `, error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as message
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex justify-center items-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endPoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant={"primary"}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
