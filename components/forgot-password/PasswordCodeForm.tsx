"use client"
import React, { useState, useCallback } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { useSignIn } from '@clerk/nextjs'
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface FormInput {
  password: string;
  code: string;
}

interface Error {
  field: string;
  message: string;
}

const PasswordCodeForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormInput>()
  const { isLoaded, signIn, setActive } = useSignIn();
  const [showPass, setshowPass] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const onSubmit = useCallback<SubmitHandler<FormInput>>(async (data) => {
    if (!isLoaded) return
    try {
      const ResetPassword = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: data.code,
        password: data.password,
      })
      if (ResetPassword.status === 'complete') {
        setActive({ session: ResetPassword.createdSessionId });
      } else {
        console.log(`ResetPassword response: ${ResetPassword}`);
        setError({
          field: 'unknown',
          message: 'An unknown error occurred. Please try again later.',
        });
      }
    } catch (err: any) {
      console.error(err.errors)
      if (err.clerkError && err.errors) {
        err.errors.forEach((error: any) => {
          if (error.code === 'form_password_pwned') {
            setError({
              field: 'password',
              message: error.message,
            })
          } else if (error.code === "form_code_incorrect") {
            setError({
              field: 'code',
              message: error.longMessage ? error.longMessage : error.message,
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
  }, [isLoaded, signIn, setActive])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove any non-numeric characters
    setValue('code', value, { shouldValidate: true });
  }, [setValue]);

  return (
    <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
      {error?.field === 'unknown' && <span className="-mt-1 text-red-500">{error?.message}</span>}
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
      <div className="w-full flex flex-col gap-2">
        <label>Code</label>
        <input
          type='text'
          className={`w-full p-2 rounded-md outline-none border ${errors.code ? "border-red-500" : "border-blue-500"}`}
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
        {errors.code && <span className="-mt-1 text-red-500">{errors.code.message}</span>}
        {error?.field === 'code' && <span className="-mt-1 text-red-500">{error?.message}</span>}
      </div>
      <input className='bg-blue-500 text-blue-50 font-semibold cursor-pointer p-2 w-full text-center rounded-md' type="submit" value="Reset" />
    </form>
  )
}

export default PasswordCodeForm
