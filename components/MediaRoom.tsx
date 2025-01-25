"use client";
import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import "@livekit/components-styles";
interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}
const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, ssetToken] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    const name = `${user?.firstName} ${user?.lastName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        ssetToken(data.token);
      } catch (e) {
        console.log(`error in media room===`, e);
      }
    })();
  }, [chatId, user?.firstName, user?.lastName]);

  if (token === "") {
    return (
      <div className="flex justify-center items-center flex-col flex-1">
        <Loader2 className="size-7 animate-spin my-4 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    token && (
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        connect={true}
        video={video}
        audio={audio}
      >
        <VideoConference />
      </LiveKitRoom>
    )
  );
};

export default MediaRoom;
