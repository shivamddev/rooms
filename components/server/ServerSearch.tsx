"use client";
import { channelType, memberRole } from "@prisma/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import {
  Hash,
  Mic,
  Search,
  ShieldAlert,
  ShieldCheck,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DialogTitle } from "../ui/dialog";

import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

const ServerSearch = ({ data }: ServerSearchProps) => {
  const IconMap = {
    [channelType.TEXT]: <Hash className="mr-2 size-4" />,
    [channelType.AUDIO]: <Mic className="mr-2 size-4" />,
    [channelType.VIDEO]: <Video className="mr-2 size-4" />,
  };

  const MemberIconMap = {
    [memberRole.GUEST]: null,
    [memberRole.MODERATOR]: (
      <ShieldCheck className="mr-2 size-4 text-indigo-500" />
    ),
    [memberRole.ADMIN]: <ShieldAlert className="mr-2 size-4" />,
  };

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);

    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);
    if (type === "member") {
      router.push(`/servers/${params?.id}/conversation/${id}`);
    }
    if (type === "channel") {
      router.push(`/servers/${params?.id}/channels/${id}`);
    }
  };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="size-4 text-zinc-500 dark:text-zinc-400" />
        <p
          className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 
        group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition
        "
        >
          Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">⌘</span> K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ icon, name, id }) => {
                  return (
                    <CommandItem key={id} onSelect={()=>onClick({id, type})}>
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
        <DialogTitle className="sr-only">Server Search Results</DialogTitle>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
