"use client"
import React, { useState, useCallback } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { useSignIn } from '@clerk/nextjs'

interface FormInput {
  email: string
}

const EmailForm = ({ onSend }: { onSend: (isSuccess: boolean) => void }) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<FormInput>()
  const { isLoaded, signIn } = useSignIn();
  const [error, setError] = useState<string>('')

  const onSubmit = useCallback<SubmitHandler<FormInput>>(async (data) => {
    if (!isLoaded) return
    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: data.email,
      })
      onSend(true)
    } catch (err: any) {
      console.error('error', err.errors[0].longMessage);
      setError(err.errors[0].longMessage);
    }
  }, [isLoaded, signIn, onSend])

  return (
    <form className='flex flex-col gap-2' onSubmit={handleSubmit(onSubmit)}>
      <label>Email Address</label>
      <input
        type='email'
        className={`w-full p-2 rounded-md outline-none border ${errors.email ? "border-red-500" : "border-blue-500"}`}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "Enter a valid email address"
          }
        })}
      />
      {errors.email && <span className="-mt-1 text-red-500">{errors.email.message}</span>}
      {error && <span className="-mt-1 text-red-500">{error}</span>}
      <input className='bg-blue-500 text-blue-50 font-semibold cursor-pointer p-2 w-full text-center rounded-md' type="submit" value="Continue" />
    </form>
  )
}

export default EmailForm
