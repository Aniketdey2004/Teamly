import { cn } from '@/lib/utils';
import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList,  Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';
import Loader from './Loader';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';
const callLayout = (layout: CallLayoutType) => {
  switch (layout) {
    case 'grid':
      return <PaginatedGridLayout />
    case 'speaker-right':
      return <SpeakerLayout participantsBarPosition='left' />
    default:
      return <SpeakerLayout participantsBarPosition='right' />
  }
}

const MeetingRoom = () => {
  const searchParams=useSearchParams();
  const isPersonalRoom= !!searchParams.get('personal');
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const router=useRouter();
  const { useCallCallingState }=useCallStateHooks();
  const callingState= useCallCallingState();
  const call=useCall();

  if(callingState === CallingState.LEFT) {
    call?.camera.disable(true);
    call?.microphone.disable(true);
    router.push('/');
    return null;
  }

  if( callingState != CallingState.JOINED) 
    return <Loader/>
  return (
    <section className='relative h-screen w-full overflow-hidden '>
      <div className='relative flex size-full items-center justify-center'>
        <div className='flex size-full max-w-[1000px] items-center'>
          {callLayout(layout)}
        </div>
        <div className={cn('h-[calc(100vh-100px)] ml-2', showParticipants? 'show-block':'hidden')}>
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap mb-2'>
        <CallControls onLeave={async ()=>{
          await call?.camera.disable(true);
          await call?.microphone.disable(true);
          await call?.leave();
        }}/>
        <DropdownMenu>
          <div className='flex items-center'>
              <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
                <LayoutList size={20} className='text-white' />
              </DropdownMenuTrigger>
          </div>
          
          <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
            {
              ['Grid', 'Speaker-left', 'Speaker-right'].map((item, index)=>(
                <div key={index}>
                    <DropdownMenuItem className='cursor-pointer' onClick={()=>{
                      setLayout(item.toLowerCase() as CallLayoutType);
                    }} >
                      {item}
                    </DropdownMenuItem>
                </div>
              ))
            } 
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton/>
        <button onClick={()=>setShowParticipants((prev)=>!prev)}>
            <div className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
                <Users size={20} className='text-white' />
            </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  )
}

export default MeetingRoom