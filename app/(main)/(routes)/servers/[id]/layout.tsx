import ServerSidebar from "@/components/server/ServerSidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Server } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
//   console.log(`profile in server id layout== `, id);
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
  });

  if (!server) {
    return redirect("/");
  }
  return (
    <div className="h-full">
      <div
        className={` max-md:hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0`}
      >
        <ServerSidebar serverId={id} />
      </div>

      <main className=" h-full md:pl-60">{children}</main>
    </div>
  );
};

export default layout;
