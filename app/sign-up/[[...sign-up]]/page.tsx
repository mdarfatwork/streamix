"use client"
import React, { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from "react-hook-form"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Verification from '@/components/SignUp/Verification'

interface FormInput {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface Error {
  field: string,
  message: string
}

const Page = () => {
  const { isLoaded, signUp } = useSignUp()
  const { register, handleSubmit, formState: { errors }, } = useForm<FormInput>()
  const [verifying, setVerifying] = useState<boolean>(false)
  const [showPass, setshowPass] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    if (!isLoaded) return
    try {
      await signUp.create({
        first_name: data.firstName,
        last_name: data.lastName,
        emailAddress: data.email,
        password: data.password,
      } as any)

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })
      setVerifying(true)
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))

      if (err.clerkError && err.errors) {
        err.errors.forEach((error: any) => {
          if (error.code === 'form_identifier_exists') {
            setError({
              field: 'email',
              message: error.message,
            })
          } else if (error.code === 'form_password_pwned') {
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
  }

  if (verifying) {
    return (
      <Verification/>
    )
  }

  return (
    <main className="flex flex-col min-h-[90vh]">
      <section className="bg-blue-50 w-11/12 sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-1/2 max-w-lg mx-auto my-auto rounded-lg xl:rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 md:p-8 lg:p-10 xl:p-12 text-blue-500 relative">
        <h2 className='text-lg text-center font-semibold'>Create your account</h2>
        <span className='w-full text-sm lg:text-base text-center block mt-1 mb-8'>Welcome ! Please fill in the details to get started.</span>
        <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
          {error?.field === 'unknown' && <span className="-mt-1 text-red-500">{error?.message}</span>}
          <div className="w-full flex flex-col gap-2">
            <label>First Name</label>
            <input 
              type='text' 
              className={`w-full p-2 rounded-md outline-none border ${errors.firstName ? "border-red-500" : "border-blue-500"}`} 
              {...register("firstName", { 
                required: "First Name is required", 
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "First Name should contain only alphabets"
                }
              })} 
            />
            {errors.firstName && <span className="-mt-1 text-red-500">{errors.firstName.message}</span>}
          </div>
          <div className="w-full flex flex-col gap-2">
            <label>Last Name</label>
            <input 
              type='text' 
              className={`w-full p-2 rounded-md outline-none border ${errors.lastName ? "border-red-500" : "border-blue-500"}`} 
              {...register("lastName", { 
                required: "Last Name is required", 
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Last Name should contain only alphabets"
                }
              })} 
            />
            {errors.lastName && <span className="-mt-1 text-red-500">{errors.lastName.message}</span>}
          </div>
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
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long"
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
                  }
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
          </div>
          <input className='bg-blue-500 text-blue-50 font-semibold cursor-pointer p-2 w-full text-center rounded-md' type="submit" />
        </form>
        <hr className='w-full border border-blue-500 mt-6 mb-4' />
        <span className="w-full block text-center">Already have an account? <strong className='cursor-pointer' onClick={() => router.push('/sign-in')}>Sign In</strong></span>
      </section>
    </main>
  )
}

export default Page;