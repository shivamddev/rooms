"use client";
import * as z from "zod";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Member, memberRole, Profile } from "@prisma/client";
import UserAvtarImage from "../UserAvtarImage";
import ActionTooltip from "../ActionTooltip";
import {
  Edit,
  FileIcon,
  FilesIcon,
  ShieldAlert,
  ShieldCheck,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { useModalStore } from "@/hooks/useModalStore";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & { profile: Profile };
  timeStamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const RoleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 size-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 size-4 text-rose-500" />,
};
const formSchema = z.object({
  content: z.string().min(1),
});
const ChatItem = ({
  id,
  content,
  member,
  timeStamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const fileType = fileUrl?.split("-");
  console.log(`fileType222222==`, fileType, fileUrl);
  const isAdmin = currentMember.role === memberRole.ADMIN;
  const isModerator = currentMember.role === memberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMsg = !deleted && (isAdmin || isOwner || isModerator);
  const canEditMsg = !deleted && isOwner && !fileUrl;
  const isPdf = fileUrl && fileType?.[1] === "pdf";
  const isImage = fileUrl && !isPdf;

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { onOpen } = useModalStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    form.reset({ content: content });
  }, [content]);

  useEffect(() => {
    console.log(`inside keydown useeffect==`);
    const handleKeyDown = (event: any) => {
      console.log(`event==`, event);
      if (event.keyCode === 27 || event.key === "Escape") {
        console.log(`inside if*********`);
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(`values==`, values);
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      const response = await axios.patch(url, values);
      console.log(`response==`, response);
      form.reset();
    } catch (error) {
      console.log(`error in message edit form on submit==`, error);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="relative group flex items-center p-4 w-full transition hover:bg-black/5">
      <div className="flex group gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvtarImage src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col  w-full">
          <div className="flex !items-center gap-x-2 ">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {RoleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {" "}
              {timeStamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileType?.[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="
          flex border rounded-md relative aspect-square overflow-hidden mt-2 items-center size-48
          bg-secondary"
            >
              <Image src={`${fileType?.[0]}`} alt="image" fill priority />
            </a>
          )}

          {isPdf && (
            <div className="  flex   items-center p-2 mt-2 rounded-md relative bg-background/10 ">
              <FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileType[0]}
                target="_blank"
                className="ml-2  !text-wrap text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                rel="noopener noreferrer"
              >
                Pdf File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                `
              text-sm text-zinc-600 dark:text-zinc-300 
              `,
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 mt-1 text-xs"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center gap-x-2 pt-2 "
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              disabled={isLoading}
                              className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                              placeholder="Edited message"
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />

                {/*  */}
                <Button disabled={isLoading} size={"sm"} variant={"primary"}>
                  Save
                </Button>
              </form>
              <span className="mt-1 text-[10px] text-zinc-400">
                Press Escap to cancel, Enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMsg && (
        <div
          className="
      hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white
       dark:bg-zinc-800 border rounded-sm
      "
        >
          {canEditMsg && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="size-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="size-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
