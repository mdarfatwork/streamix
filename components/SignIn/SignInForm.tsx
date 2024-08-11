"use client"
import React, { useState, useCallback } from 'react'
import { useSignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { useForm, SubmitHandler } from "react-hook-form"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from 'next/navigation'

interface FormInput {
  email: string
  password: string
}

interface Error {
  field: string,
  message: string
}

const SignInForm = () => {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { register, handleSubmit, formState: { errors }, } = useForm<FormInput>()
  const [showPass, setshowPass] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  const onSubmit = useCallback<SubmitHandler<FormInput>>(async (data) => {
    if (!isLoaded) return
    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      } as any)

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.push('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(err.errors)
      if (err.clerkError && err.errors) {
        err.errors.forEach((error: any) => {
            if (error.code === 'form_identifier_not_found') {
                setError({
                    field: 'email',
                    message: error.message,
                })
            } else if (error.code === 'form_password_incorrect') {
              setError({
                  field: 'password',
                  message: error.message,
              })
          } else {
                setError({
                    field: 'unknown',
                    message: error.message,
                })
            }
        })
      }
    }
  }, [isLoaded, signIn, setActive, router])

  return (
    <section className="bg-blue-50 w-11/12 sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-1/2 max-w-lg mx-auto my-auto rounded-lg xl:rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 md:p-8 lg:p-10 xl:p-12 text-blue-500 relative">
      <h2 className='text-lg text-center font-semibold'>Sign in to streamix</h2>
      <span className='w-full text-sm lg:text-base text-center block mt-1 mb-8'>Welcome back! Please sign in to continue</span>
      <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
        {error?.field === 'unknown' && <span className="-mt-1 text-red-500">{error?.message}</span>}
        <div className="w-full flex flex-col gap-2">
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
          {error?.field === 'email' && <span className="-mt-1 text-red-500">{error?.message}</span>}
        </div>
        <div className="w-full flex flex-col gap-2 mb-2">
          <label>Password</label>
          <div className={`relative border rounded-md ${errors.password ? "border-red-500" : "border-blue-500"}`}>
            <input
              type={showPass ? "text" : "password"}
              className='w-full p-2 rounded-md outline-none'
              {...register("password", {
                required: "Password is required",
              })}
            />
            <span className="absolute h-full right-3 cursor-pointer text-blue-500">
              {showPass ? (
                <FaEyeSlash onClick={() => setshowPass(false)} className="p-1 text-2xl my-auto h-full" />
              ) : (
                <FaEye onClick={() => setshowPass(true)} className="p-1 text-2xl my-auto h-full" />
              )}
            </span>
          </div>
          {errors.password && <span className="-mt-1 text-red-500">{errors.password.message}</span>}
          {error?.field === 'password' && <span className="-mt-1 text-red-500">{error?.message}</span>}
          <Link href='/forgot-password'><span className='text-sm lg:text-base text-blue-500'>Forgot Password?</span></Link>
        </div>
        <input className='bg-blue-500 text-blue-50 font-semibold cursor-pointer p-2 w-full text-center rounded-md' type="submit" value="Continue" />
      </form>
      <hr className='w-full border border-blue-500 mt-6 mb-4' />
      <span className="w-full block text-center">Don't have an account? <Link href='/sign-up'><strong className='cursor-pointer'>Sign Up</strong></Link></span>
    </section>
  )
}

export default SignInForm