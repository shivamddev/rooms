import { auth, getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export const currentProfilePage = async (req: NextApiRequest) => {
  //   const { userId } = await auth();
  const { userId } = getAuth(req);
  // console.log(`page user id===`, userId);
  if (!userId) return null;
  // console.log(`!userId===`, !userId);

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  // console.log(`profile in page===`, profile);

  return profile;
};
