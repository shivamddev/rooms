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
    // console.log(`rofile in messages api===`, profile);
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { content, fileUrl } = req.body;
    // console.log(`content===`, content);
    // console.log(`fileUrl===`, fileUrl);
    const conversationID = req.query.conversationId;

    console.log(`req.query===`, req.query);
    console.log(`conversationID===`, conversationID);
    if (!conversationID) {
      return res.status(400).json({ error: "conversationID is missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "content is missing" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationID as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: "conversation not found" });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    const message = await db.directMessage.create({
      data: {
        content: content,
        fileUrl: fileUrl,
        memberId: member.id,
        conversationId: conversation.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${conversationID}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json({ message });
  } catch (err) {
    console.log(`error in direct messages post api in sockets===`, err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
