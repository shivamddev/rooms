import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  console.log(`inside patch route++++++`);
  try {
    const { serverId } = params; // Destructure serverId directly from params
    const { name, imageUrl } = await req.json();
    console.log(`param***`, serverId);
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        profileId: profile.id,
        id: serverId,
      },
      data: {
        name,
        imageUrl,
      },
    });
    return NextResponse.json(server);
  } catch (err) {
    console.log(`error in server patch route == `, err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  console.log(`inside delete route++++++`);
  try {
    const { serverId } = params; // Destructure serverId directly from params
    // const { name, imageUrl } = await req.json();
    console.log(`param***`, serverId);
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }

    const server = await db.server.delete({
      where: {
        profileId: profile.id,
        id: serverId,
      },
    });
    return NextResponse.json(server);
  } catch (err) {
    console.log(`error in server delete route == `, err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
