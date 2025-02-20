import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
interface ServerIDPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ServerIDPage = async ({ params }: ServerIDPageProps) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  console.log(`param==`, id);
  const profile = await currentProfile();
  const { userId, redirectToSignIn } = await auth();
  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: id,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels?.[0];
  console.log(`intiialChannel==`, initialChannel);

  if (initialChannel?.name.toLocaleLowerCase() !== "general") {
    console.log(`inside if not general`);
    return null;
  }
  return redirect(`/servers/${id}/channels/${initialChannel.id}`);
};

export default ServerIDPage;
