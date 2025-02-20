import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  console.log(`inside delete 1`);
  try {
    const resolvedParams = await params;
    const memberId = resolvedParams.memberId;
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }
    if (!serverId) {
      return new NextResponse("server Id is missing", {
        status: 400,
      });
    }

    if (!memberId) {
      return new NextResponse("member Id is missing", {
        status: 400,
      });
    }

    console.log(`inside delete 2`);

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    // console.log(`server===`, server);

    return NextResponse.json(server);
  } catch (err) {
    console.log(`error in DELETE function in memberId route==`, err);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const resolvedParams = await params;
    const memberId = resolvedParams.memberId;

    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const serverId = searchParams.get("serverId");
    console.log(`memberId==`, memberId);
    if (!serverId) {
      return new NextResponse("Server Id is missing", {
        status: 400,
      });
    }

    if (!memberId) {
      return new NextResponse("member Id is missing", {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },

      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log(`error in PATCH function in memberId route==`, err);

    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}


