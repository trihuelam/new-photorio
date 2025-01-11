import Link from 'next/link';
import Image from 'next/image';
import ObjectID from 'bson-objectid';
import { auth } from '@clerk/nextjs';
import { Work } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';

import db from '@/lib/db';
import WorkCard from '@/components/work-card';
import WorkOwner from '@/components/work-owner';
import WorkDelete from '@/components/work-delete';
import WorkHeader from '@/components/work-header';
import WorkLayout from '@/components/ui/work-layout';
import { Separator } from '@/components/ui/separator';

type Props = {
  params: { workId: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const work = await db.work.findUnique({
    where: {
      id: params.workId
    }
  });

  // optionally access and extend (rather than replace) parent metadata
  const previousOpenGraphImages = (await parent).openGraph?.images || [];
  const previousTwitterImages = (await parent).twitter?.images || [];

  return {
    title: work?.title + ' | Photorio',
    description: work?.description,
    openGraph: {
      images:
        typeof work?.image === 'string'
          ? [{ url: work.image }, ...previousOpenGraphImages]
          : previousOpenGraphImages
    },
    twitter: {
      images:
        typeof work?.image === 'string'
          ? [{ url: work.image }, ...previousTwitterImages]
          : previousTwitterImages
    }
  };
}

export default async function WorkPage({
  params
}: {
  params: { workId: string };
}) {
  const { userId } = auth();

  const isValidId = ObjectID.isValid(params.workId);

  if (!isValidId) {
    notFound();
  }

  const work = await db.work.findUnique({
    where: {
      id: params.workId
    }
  });

  if (!work) {
    notFound();
  }

  const moreWorks = await db.work.findMany({
    take: 12,
    where: {
      userId: work.userId,
      NOT: {
        id: work.id
      }
    }
  });

  const alsoLikeWorks = await db.work.findMany({
    take: 12,
    where: {
      category: work.category,
      NOT: {
        id: work.id
      }
    }
  });

  // randomize work list sorting
  const shuffle = (array: Work[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  return (
    <WorkLayout>
      <div className='w-full relative pb-[70px]'>
        <WorkHeader userId={work.userId} title={work.title} />
        <div className='flex justify-center md:px-4 lg:px-[120px]'>
          <div className='w-full flex flex-col items-center max-w-6xl'>
            <div className='w-full flex flex-col relative max-w-5xl'>
              <Image
                src={work.image}
                alt={work.title}
                width={1024}
                height={768}
                priority
                className='my-7 md:rounded-md contrast-[0.95]'
              />
              <p className='font-medium text-lg my-8 px-4 md:px-0 text-justify'>
                {work.description}
              </p>
            </div>
            <div className='flex justify-center mt-20'>
              {userId !== null && userId === work.userId && (
                <div className='p-6 rounded-lg bg-[#fafafb] inline-flex gap-6'>
                  <Link
                    href={`/work/${work.id}/edit`}
                    className='text-[#3d3d4e] text-sm'
                  >
                    Edit
                  </Link>
                  <WorkDelete work={work} />
                </div>
              )}
            </div>
            <WorkOwner userId={work.userId} moreWorks={shuffle(moreWorks)} />
          </div>
        </div>
        {alsoLikeWorks.length > 0 && (
          <>
            <Separator className='w-full h-[2px] my-20' />
            <div className='w-full flex flex-col items-center md:px-4 lg:px-[120px]'>
              <div className='w-full max-w-6xl px-4 md:px-0'>
                <h5 className='font-bold'>You might also like</h5>
                <div className='w-full flex justify-center'>
                  <div className='w-full gap-9 pt-4 grid md:grid-cols-2 xl:grid-cols-3'>
                    {shuffle(alsoLikeWorks)
                      .slice(0, 6)
                      .map((work) => (
                        <WorkCard
                          key={work.id}
                          work={work}
                          isProfile={false}
                          isAlsoLikeWorks={true}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </WorkLayout>
  );
}
