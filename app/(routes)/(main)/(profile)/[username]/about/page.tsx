import { notFound } from 'next/navigation';
import type { User } from '@clerk/nextjs/server';
import { Metadata, ResolvingMetadata } from 'next';
import { clerkClient, currentUser } from '@clerk/nextjs';

import db from '@/lib/db';
import ProfileNav from '@/components/profile-nav';
import ProfileAbout from '@/components/profile-about';
import ProfileHeader from '@/components/profile-header';

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { username } = await params; // Await the params promise.

  const profile = await db.profile.findUnique({
    where: {
      username: username,
    },
  });

  if (!profile) {
    notFound();
  }

  const user = await clerkClient.users.getUser(profile.userId);

  const previousTitle = (await parent).title || '';

  return {
    title:
      typeof user.firstName === 'string'
        ? `${user.firstName} ${user.lastName} | Bribbble`
        : previousTitle,
  };
}
export default async function AboutPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params; // Await the params promise.

  let user: User;

  // Get logged-in user
  const loggedInUser = await currentUser();

  // Get user profile of the username
  const profile = await db.profile.findUnique({
    where: {
      username: username,
    },
  });

  if (!profile) {
    notFound();
  }

  // Check if logged-in user is the owner of the profile page
  if (loggedInUser && loggedInUser.id === profile.userId) {
    user = loggedInUser;
  } else {
    user = await clerkClient.users.getUser(profile.userId);
  }

  if (!user) {
    notFound();
  }

  // Get user's works
  const [works, totalWorks] = await db.$transaction([
    db.work.findMany({
      take: 12,
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    db.work.count({
      where: {
        userId: user.id,
      },
    }),
  ]);

  return (
    <section className="flex flex-col justify-start items-center lg:px-20 py-6 px-5">
      <ProfileHeader
        user={user}
        profile={profile}
        works={works}
        isOwner={
          loggedInUser && loggedInUser.id === profile.userId ? true : false
        }
      />
      <ProfileNav username={profile.username} activeNav="about" />

      <div className="w-full py-12 flex flex-col items-center justify-center">
        <ProfileAbout user={user} profile={profile} />
      </div>
    </section>
  );
}
