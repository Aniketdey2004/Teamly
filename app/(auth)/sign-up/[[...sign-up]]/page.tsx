import { SignUp } from '@clerk/nextjs'


const SignUpPage = () => {
  return (
    <main className='flex h-screen w-full items-center justify-center overflow-y-auto py-4'>
        <SignUp/>
    </main>
  )
}

export default SignUpPage