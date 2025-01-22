import { currentProfilePage } from "@/lib/current-profile-page";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile: any = await currentProfilePage(req);
    console.log(`rofile in messages api===`, profile);
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { content, fileUrl } = req.body;
    console.log(`content===`, content);
    console.log(`fileUrl===`, fileUrl);
    const { serverId, channelId } = req.query;
    console.log(`serverId===`, serverId);
    console.log(`channelId===`, channelId);
    if (!serverId) {
      return res.status(401).json({ error: "serverId is missing" });
    }
    if (!channelId) {
      return res.status(401).json({ error: "channelId is missing" });
    }
    if (!content) {
      return res.status(401).json({ error: "content is missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    console.log(`profile.id==`, profile.id);
    console.log(`****`, server.members);
    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ error: "member not found" });
    }

    const message = await db.message.create({
      data: {
        content: content,
        fileUrl: fileUrl,
        memberId: member.id,
        channelId: channel.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json({ message });
  } catch (err) {
    console.log(`error in messages api in sockets===`, err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
