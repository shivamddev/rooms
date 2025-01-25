import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage, Message } from "@prisma/client";
import { NextResponse } from "next/server";
const Message_Batch = 10;
export async function GET(req: Request) {
  try {
    // const data = await req.json();
    const { searchParams } = new URL(req.url);
    console.log(`searchParams-`, searchParams);
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");
    console.log(`cursor--`, cursor);
    console.log(`conversationId--`, conversationId);

    if (!conversationId) {
      return new NextResponse("conversationId is missing", { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor && cursor !== "0" && cursor !== undefined) {
      console.log(`inside if`);
      messages = await db.directMessage.findMany({
        take: Message_Batch,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId: conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      console.log(`inside else part`);
      console.log(conversationId);
      messages = await db.directMessage.findMany({
        take: Message_Batch,
        where: {
          conversationId: conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    //   console.log(`messages33---`, messages);
    }
    let nextCursor = null;
    // console.log(`messages55---`, messages);

    if (messages.length === Message_Batch) {
      nextCursor = messages[Message_Batch - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (err) {
    console.log(`error in Get messages route=`, err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
