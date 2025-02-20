import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const resolvedParams = await params;
    const serverId = resolvedParams?.serverId;
    const profile = await currentProfile();
    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new Response("Server Id is missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log(`error in PATCH function in leave route==`, err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
