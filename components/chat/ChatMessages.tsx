"use client";
import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";
import ChatItem from "./ChatItem";
import { format } from "date-fns";
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
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  console.log(`status===`, status);

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
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />

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
    </div>
  );
};

export default ChatMessages;
