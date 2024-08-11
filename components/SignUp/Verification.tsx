"use client"
import React, { useState, useCallback } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"

interface FormInput {
  code: string
}

const Verification = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormInput>()
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const onSubmit: SubmitHandler<FormInput> = useCallback(async (data) => {
    if (!isLoaded) return
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        const res = await axios.post('/api/sign-up', {
          createdUserId: completeSignUp?.createdUserId,
          firstName: completeSignUp?.firstName,
          lastName: completeSignUp?.lastName,
          emailAddress: completeSignUp?.emailAddress
        });
        router.push('/')
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      console.error(err.errors)
      if (err.clerkError && err.errors) {
        err.errors.forEach((error: any) => {
          setError(error.longMessage ? error.longMessage : error.message)
        })
      }
    }
  }, [isLoaded, signUp, setActive, router])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setValue('code', value, { shouldValidate: true });
  }, [setValue])

  return (
    <section className="bg-blue-50 w-11/12 sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-1/2 max-w-md mx-auto my-auto rounded-lg xl:rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 md:p-8 lg:p-10 xl:p-12 text-blue-500">
      <h2 className='text-lg text-center font-semibold'>Verify your email</h2>
      <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-2'>
          <label id="code" className='text-center'>Enter your verification code</label>
          <input
            type='text'
            className={`w-fit text-center mx-auto p-2 outline-none border-b bg-blue-50 text-xl font-semibold ${errors.code ? "border-red-500" : "border-blue-500"}`}
            maxLength={6}
            minLength={6}
            {...register("code", {
              required: "Code is required",
              pattern: {
                value: /^\d*$/,
                message: "Code should contain only Numbers"
              },
              onChange: handleInputChange,
            })}
          />
          {errors.code && <span className="-mt-1 text-red-500 text-center">{errors.code.message}</span>}
          {error && <span className="-mt-1 text-red-500 text-center">{error}</span>}
        </div>
        <input className='bg-blue-500 text-blue-50 font-semibold cursor-pointer p-2 w-full text-center rounded-md' type="submit" value="Continue" />
      </form>
    </section>
  )
}

export default Verification;