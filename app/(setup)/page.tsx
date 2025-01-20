import InitialModal from '@/components/modals/InitialModal';
import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async () => {

    const profile = await initialProfile();
    console.log(`profile`, profile);

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    })


    // console.log(`server= `, server);

    if(server){
        return redirect(`/servers/${server.id}`)
    }

  return (
    <div>
      <InitialModal />
    </div>
  )
}

export default Page
