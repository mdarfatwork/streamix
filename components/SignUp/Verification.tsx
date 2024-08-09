"use client"
import React, { useState, useEffect} from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const Verification = () => {
    const { isLoaded, signUp, setActive } = useSignUp()
    const [code, setCode] = useState<string>('')
    const [error, setError] = useState<any>('')
    const router = useRouter()

    const handleVerify = async () => {
      if (!isLoaded) return
      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: code,
        })

        if (completeSignUp.status === 'complete') {
          await setActive({ session: completeSignUp.createdSessionId })
          const res = await axios.post('/api/sign-up', {
            createdUserId: completeSignUp?.createdUserId,
            firstName: completeSignUp?.firstName,
            lastName:completeSignUp?.lastName,
            emailAddress: completeSignUp?.emailAddress
          });
          // console.log(res)
          router.push('/')
        } else {
          // If the status is not complete, check why. User may need to
          // complete further steps.
          console.error(JSON.stringify(completeSignUp, null, 2))
        }
      } catch (err: any) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error('Error:', JSON.stringify(err, null, 2))
        if (err.clerkError && err.errors) {
          err.errors.forEach((error: any) => {
            setError(error.longMessage ? error.longMessage : error.message)
          })
        }
      }
    }

    useEffect(() => {
      if (code.length === 6) {
        handleVerify();
      }
    }, [code]);
  
    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d*$/.test(value)) {
        setCode(value);
      }
    };

    return (
        <main className='flex flex-col min-h-[90vh]'>
            <section className="bg-blue-50 w-11/12 sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-1/2 max-w-md mx-auto my-auto rounded-lg xl:rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 md:p-8 lg:p-10 xl:p-12 text-blue-500">
                <h2 className='text-lg text-center font-semibold'>Verify your email</h2>
                <form className='flex flex-col gap-8'>
                    <div className='flex flex-col gap-2'>
                        <label id="code" className='text-center'>Enter your verification code</label>
                        <input 
                            type="text"
                            className={`w-fit text-center mx-auto p-2 outline-none border-b bg-blue-50 text-xl font-semibold ${error ? "border-red-500" : "border-blue-500"}`}
                            onChange={handleCodeChange}
                            value={code}
                            minLength={6}
                            maxLength={6}
                        />
                        {error && <span className="-mt-1 text-red-500 text-center">{error}</span>}
                    </div>
                    <button onClick={handleVerify} className='bg-blue-500 text-blue-50 font-semibold cursor-pointer p-2 w-full text-center rounded-md'>verify</button>
                </form>
            </section>
        </main>
    )
}

export default Verification;