import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    // console.log(`inside try`);

    const { serverId } = params; // Destructure serverId directly from params
    // console.log(`1 id == `, serverId);

    const profile = await currentProfile();
    // console.log(`2 profile == `, profile);

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    // console.log(`3 server == `, server);

    return NextResponse.json(server);
  } catch (err) {
    console.log(`error in server id patch route == `, err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
