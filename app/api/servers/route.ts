import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { memberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export  async function POST(req: Request) {

    console.log(`insdie POST`);
    try{
        const { name, imageUrl} = await req.json();
        console.log("name= ", name, " imageUrl= ", imageUrl);
        const profile = await currentProfile();
        console.log("profile = ", profile);
        if(!profile) return new NextResponse("Unauthorized", {status: 401});

        const server = await db.server.create({
            data:{
                profileId: profile.id,
                name: name,
                imageUrl: imageUrl,
                inviteCode: uuidv4(),
                channels:{
                    create: [
                        {
                            name: "General",
                            profileId: profile.id,
                        }
                    ]
                },
                members:{
                    create: [
                        {
                            profileId: profile.id,
                            role: memberRole.ADMIN,
                        }
                    ]
                }
            }
        })


        // console.log(`server=`, server);

        // return new NextResponse("Server created successfully", {status: 200});
        return NextResponse.json(server);


    }catch(error : any){
        console.log("error in server route", error?.message );
        return new NextResponse("Internal server error", {status: 500});
    }
}