import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { memberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log(`url ===`, req.url);
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    console.log(`searchParams: ${searchParams}`);
    const profile = await currentProfile();
    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    }

    const serverId = searchParams.get("serverId");
    console.log(`serverId: ${serverId}`);

    if (!serverId) {
      return new Response("Server Id is missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [memberRole.ADMIN, memberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json({ server });
  } catch (err) {
    console.log(`error in POST API in Channels - `, err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
