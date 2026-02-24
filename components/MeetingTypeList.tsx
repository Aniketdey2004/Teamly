'use client';

import { toast } from "sonner"
import HomeCard from "./HomeCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";

const initialValues = {
    dateTime: new Date(),
    description: '',
    link: ''
};

const MeetingTypeList = () => {
    const router = useRouter();
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();

    const [values, setValues] = useState(initialValues);
    const [callDetail, setCallDetail] = useState<Call>();
    const client = useStreamVideoClient();
    const { user } = useUser();


    const createMeeting = async () => {
        try {
            if (!values.dateTime) {
                toast.error('Please select a date and time');
                return;
            }

            const id = crypto.randomUUID();
            const call = client?.call('default', id);

            if (!call) throw new Error('Failed to create meeting');

            const startsAt = values.dateTime.toISOString() || new Date().toISOString();
            const description = values.description || 'Instant Meeting';

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description,
                    },
                },
            });

            setCallDetail(call);

            if(!values.description){
                router.push(`/meeting/${call.id}`);
            }

            toast.success('Meeting created Successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create meeting');
        }
    }
    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <HomeCard
                img='/icons/add-meeting.svg'
                title='New Meeting'
                description='Start an instant meeting'
                handleClick={() => setMeetingState('isInstantMeeting')}
                className='bg-orange-1'
            />
            <HomeCard
                img='/icons/schedule.svg'
                title='Schedule Meeting'
                description='Plan your meeting'
                handleClick={() => setMeetingState('isScheduleMeeting')}
                className='bg-blue-1'
            />
            <HomeCard
                img='/icons/recordings.svg'
                title='View Recordings'
                description='Check out your recordings'
                handleClick={() => router.push('/recordings')}
                className='bg-purple-1'
            />
            <HomeCard
                img='/icons/join-meeting.svg'
                title='Join Meeting'
                description='via invitation link'
                handleClick={() => setMeetingState('isJoiningMeeting')}
                className='bg-yellow-1'
            />
            <MeetingModal
                isOpen={meetingState === 'isInstantMeeting'}
                onClose={() => setMeetingState(undefined)}
                title='Start an Instant Meeting'
                className='text-center'
                buttonText='Start Meeting'
                handleClick={createMeeting}
            />
        </section>
    )
}

export default MeetingTypeList