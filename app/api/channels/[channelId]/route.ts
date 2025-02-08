import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { memberRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { URL } from 'url';

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ channelId: string }> },
) {
	console.log(`inside delete channel api****`);
	try {
		const { channelId } = await params;
		const profile = await currentProfile();
		const { searchParams } = new URL(req.url);
		const serverId = searchParams.get('serverId');

		console.log(`id==***`, channelId);

		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		if (!serverId) {
			return new NextResponse('Server Id is missing', { status: 400 });
		}

		if (!channelId) {
			return new NextResponse('Channel Id is missing', { status: 400 });
		}

		const server = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [memberRole.ADMIN, memberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				channels: {
					delete: {
						id: channelId,
						name: {
							not: 'general',
						},
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (err) {
		console.log(`error in delete channel api route==`, err);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ channelId: string }> },
) {
	console.log(`inside patch channel api****`);
	try {
		const { channelId } = await params;
		const { name, type } = await req.json();
		const profile = await currentProfile();
		const { searchParams } = new URL(req.url);
		const serverId = searchParams.get('serverId');

		console.log(`id==***`, channelId);

		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		if (!serverId) {
			return new NextResponse('Server Id is missing', { status: 400 });
		}

		if (!channelId) {
			return new NextResponse('Channel Id is missing', { status: 400 });
		}

		if (name === 'general') {
			return new NextResponse("Name cannot be 'general'", { status: 400 });
		}

		const server = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [memberRole.ADMIN, memberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				channels: {
					update: {
						where: {
							id: channelId,
							NOT: {
								name: 'general',
							},
						},
						data: {
							name,
							type,
						},
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (err) {
		console.log(`error in patch channel api route==`, err);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
