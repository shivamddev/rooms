"use client";
import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useRef } from "react";
import ChatItem from "./ChatItem";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useChatScroll } from "@/hooks/useChatScroll";
interface ChatMessagesProps {
  name: string;
  member: Member;
  apiUrl: string;
  chatId: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const Date_Format = "d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};
const ChatMessages = ({
  name,
  member,
  apiUrl,
  chatId,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  // const chatRef = useRef<ElementRef<"div">>
  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  useChatSocket({ addKey, updateKey, queryKey });

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  // console.log(`status===`, status);
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length,
  });

  if (status === "pending") {
    return (
      <div className="flex-1 flex flex-col justc-center items-center">
        <Loader2 className="size-7 animate-spin my-4 text-zinc-700" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex-1 flex flex-col justc-center items-center">
        <ServerCrash className="size-7  my-4 text-zinc-700" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }
  //   console.log(`data-----`, data);
  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="size-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xs my-4 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse ml-4">
        {data?.pages?.map((group, index) => {
          //   console.log(`group-`, group);
          return (
            <Fragment key={index}>
              {group?.items?.map(
                (message: MessageWithMemberWithProfile, index2: any) => {
                  return (
                    <ChatItem
                      key={index2}
                      id={message.id}
                      currentMember={member}
                      content={message.content}
                      member={message.member}
                      fileUrl={message.fileUrl}
                      deleted={message.deleted}
                      timeStamp={format(
                        new Date(message.createdAt),
                        Date_Format
                      )}
                      isUpdated={message.updatedAt !== message.createdAt}
                      socketQuery={socketQuery}
                      socketUrl={socketUrl}
                    />
                  );
                }
              )}
            </Fragment>
          );
        })}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
