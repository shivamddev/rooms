import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import MediaRoom from '@/components/MediaRoom';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { channelType } from '@prisma/client';
import { redirect } from 'next/navigation';

type ChannelIDPageProps = Promise<{
	id: string;
	channelId: string;
}>;

const Page = async ({ params }: { params: ChannelIDPageProps }) => {
	const { id, channelId } = await params;
	const { userId, redirectToSignIn } = await auth();
	const profile = await currentProfile();
	if (!profile) {
		return redirectToSignIn();
	}

	const channel = await db.channel.findUnique({
		where: {
			id: channelId,
		},
	});

	const member = await db.member.findFirst({
		where: {
			serverId: id,
			profileId: profile.id,
		},
	});

	if (!channel || !member) {
		return redirect(`/`);
	}

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader
				name={channel.name}
				serverId={channel.serverId}
				type="channel"
			/>

			{channel?.type === channelType.TEXT && (
				<>
					<ChatMessages
						name={channel.name}
						member={member}
						chatId={channel.id}
						apiUrl={`/api/messages`}
						socketUrl={`/api/socket/messages`}
						socketQuery={{
							serverId: channel.serverId,
							channelId: channel.id,
						}}
						paramKey="channelId"
						paramValue={channel.id}
						type="channel"
					/>
					<ChatInput
						apiUrl={`/api/socket/messages`}
						name={channel.name}
						Query={{
							serverId: channel.serverId,
							channelId: channel.id,
						}}
						type="channel"
					/>
				</>
			)}

			{channel.type === channelType.AUDIO && (
				<>
					<MediaRoom
						chatId={channel?.id}
						video={false}
						audio={true}
					/>
				</>
			)}

			{channel.type === channelType.VIDEO && (
				<>
					<MediaRoom
						chatId={channel?.id}
						video={true}
						audio={true}
					/>
				</>
			)}
		</div>
	);
};

export default Page;
