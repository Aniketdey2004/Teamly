'use client';
import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { Button } from '@/components/ui/button';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


const Meeting = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const router=useRouter();
  const { user, isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const { call, isCallLoading } = useGetCallById(id);

  if (!isLoaded || isCallLoading)
    return <Loader />

  const now = new Date();
  const startsAt = call?.state.startsAt;

  if (startsAt && now <= new Date(startsAt)) {
    return (
      <main className='h-screen w-full flex items-center justify-center text-white'>
        <div className='flex flex-col items-center gap-4'>
          <h1 className='text-2xl font-bold'>Meeting Not Started Yet</h1>
          <p className='text-sky-1'>
            This meeting starts at {new Date(startsAt).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <Button onClick={()=>router.push('/')} className='bg-blue-1 cursor-pointer'>
              Back Home
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {
            !isSetupComplete ? (<MeetingSetup setIsSetupComplete={setIsSetupComplete} />) : (<MeetingRoom />)
          }
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting;