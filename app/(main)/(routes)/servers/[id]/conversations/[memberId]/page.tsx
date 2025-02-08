import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import MediaRoom from '@/components/MediaRoom';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
type PageParams = Promise<{
	id: string;
	memberId: string;
}>;
type SearchParams = Promise<{
	video?: boolean;
}>;

const Page = async ({
	params,
	searchParams,
}: {
	params: PageParams;
	searchParams: SearchParams;
}) => {
	const { id, memberId } = await params;
	const { video } = await searchParams;
	const { userId, redirectToSignIn } = await auth();
	const profile = await currentProfile();
	if (!profile) {
		return redirectToSignIn();
	}

	const currentMember = await db.member.findFirst({
		where: {
			serverId: id,
			profileId: profile.id,
		},
		include: {
			profile: true,
		},
	});

	if (!currentMember) {
		return redirect(`/`);
	}

	const conversation = await getOrCreateConversation(
		currentMember.id,
		memberId,
	);

	if (!conversation) {
		return redirect(`/servers/${id}`);
	}

	const { memberOne, memberTwo } = conversation;
	const otherMember =
		memberOne.profileId === profile.id ? memberTwo : memberOne;
	return (
		<div className="bg-white dark:bg-[#313338] h-full flex flex-col ">
			<ChatHeader
				imageUrl={otherMember.profile.imageUrl}
				name={otherMember.profile.name}
				serverId={id}
				type="conversation"
			/>

			{video && (
				<MediaRoom
					chatId={conversation.id}
					video={true}
					audio={false}
				/>
			)}

			{!video && (
				<>
					<ChatMessages
						member={currentMember}
						name={otherMember.profile.name}
						chatId={conversation.id}
						type="conversation"
						paramKey="conversationId"
						paramValue={conversation.id}
						apiUrl="/api/direct-messages"
						socketUrl="/api/socket/direct-messages"
						socketQuery={{
							conversationId: conversation.id,
						}}
					/>
					<ChatInput
						name={otherMember.profile.name}
						type="conversation"
						apiUrl="/api/socket/direct-messages"
						Query={{
							conversationId: conversation.id,
						}}
					/>
				</>
			)}
		</div>
	);
};

export default Page;
