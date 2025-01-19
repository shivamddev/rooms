import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
interface InviteCodeProps {
  params: {
    inviteCode: string;
  };
}

const Page = async ({ params }: InviteCodeProps) => {
  const { userId, redirectToSignIn } = await auth();
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  if (!params?.inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default Page;
