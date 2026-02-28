import Image from 'next/image';
import { Button } from './ui/button';
import { toast } from "sonner"

interface MeetingCardProps {
    title: string;
    date: string;
    icon: string;
    isPreviousMeeting?: boolean;
    buttonIcon1?: string;
    buttonText?: string;
    handleClick: () => void;
    link: string
}
const MeetingCard = ({ icon, title, date, isPreviousMeeting, buttonIcon1, handleClick, link, buttonText }: MeetingCardProps) => {
    return (
        <section className='flex min-h-[200px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]'>
            <article className='flex flex-col gap-5'>
                <Image src={icon} width={28} height={28} alt='feature'/>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-2xl font-bold'>{title}</h1>
                    <p className='text-base font-normal'>{date}</p>
                </div>
            </article>
            {
                !isPreviousMeeting && (
                    <div className='flex gap-2 justify-end'>
                        <Button onClick={handleClick} className='rounded bg-blue-1 px-6'>
                            {
                                buttonIcon1 && (
                                    <Image src={buttonIcon1} width={20} height={20} />
                                )
                            }
                            &nbsp; {buttonText}
                        </Button>
                        <Button onClick={() => {
                            navigator.clipboard.writeText(link);
                            toast.success('Link Copied')
                        }
                        } className='bg-dark-4 px-6'>
                            <Image
                                src="/icons/copy.svg"
                                alt="feature"
                                width={20}
                                height={20}
                            />
                            &nbsp; Copy Link
                        </Button>
                    </div>
                )
            }
        </section>
    )
}

export default MeetingCard