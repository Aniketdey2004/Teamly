'use server';

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const STREAM_API_KEY= process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET=process.env.STREAM_SECRET_KEY;

export const tokenProvider=async()=>{
    const user=await currentUser();

    if(!user) throw new Error('User is not authenticated'); 
    if(!STREAM_API_KEY) throw new Error('Stream API key secret is missing');
    if(!STREAM_API_SECRET) throw new Error('Stream Api secret is missing');

    const streamClient=new StreamClient(STREAM_API_KEY,STREAM_API_SECRET);

    const token=streamClient.generateUserToken({
        user_id: user.id,
        validity_in_seconds: 3600
    });

    return token;
}

export const createScheduleMeeting= async (startsAt:string, description:string)=>{
    const user=await currentUser();
    if(!user) throw new Error('User is not authenticated'); 
    if(!STREAM_API_KEY) throw new Error('Stream API key secret is missing');
    if(!STREAM_API_SECRET) throw new Error('Stream Api secret is missing');

    const streamClient=new StreamClient(STREAM_API_KEY,STREAM_API_SECRET);

    const id=crypto.randomUUID();
    const call=streamClient.video.call('default', id);


    await call.create({
        data:{
            created_by_id:user.id,
            starts_at:new Date(startsAt),
            custom:{ description}
        }
    });

    return id;
}