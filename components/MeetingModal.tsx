import { ReactNode } from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { X } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from './ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';


interface MeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    className?: string;
    children?: ReactNode;
    handleClick?: () => void;
    buttonText?: string;
    image?: string;
    buttonIcon?: string;
}

const MeetingModal = ({ isOpen, onClose, title, className, children, handleClick, buttonText, image, buttonIcon }: MeetingModalProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className='flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white'>
                <div className='flex flex-col gap-6'>
                    <VisuallyHidden>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                    </VisuallyHidden>
                    {/* check later might cause error */}
                    <AlertDialogCancel className='absolute top-4 right-4 border-none bg-transparent hover:bg-transparent p-0 text-white hover:text-gray-300'>
                        <X size={20} />
                    </AlertDialogCancel>
                    {
                        image && (
                            <div className='flex justify-center'>
                                <Image src={image} alt='image' width={72} height={72} />
                            </div>
                        )
                    }
                    <h1 className={cn('text-3xl font-bold ', className)}>{title}</h1>
                    {children}
                    <Button className='bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0' onClick={handleClick}>
                        {
                            buttonIcon && (
                                <Image src={buttonIcon} alt='button icon' width={13} height={13} />
                            )
                        }
                        {buttonText || 'Schedule Meeting'}
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default MeetingModal