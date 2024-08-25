"use client"
import React, { useState, useCallback, useMemo } from 'react'
import { useSignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { useForm, SubmitHandler } from "react-hook-form"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  const { register, handleSubmit, formState: { errors } } = useForm<FormInput>()
  const [showPass, setshowPass] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [loadRazorpay, setLoadRazorpay] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleToggleShowPass = useCallback(() => setshowPass((prevShowPass) => !prevShowPass), []);

  const handleGetUser = useCallback(async (email: string | null) => {
    if (email === null) return null;
    try {
      const res = await axios.post(`/api/find-user`, { email });
      return res.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  const handleGetSubscription = useCallback(async (subscriptionId: string) => {
    try {
      const res = await axios.post(`/api/fetch-subscription`, { subscriptionId });
      return res.data.subscription;
    } catch (error) {
      console.error(error);
      return error;
    }
  }, []);

  const onSubmit = useCallback<SubmitHandler<FormInput>>(async (data) => {
    if (!isLoaded) return
    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      } as any)

      if (signInAttempt.status === 'complete') {
        const getUser = await handleGetUser(signInAttempt.identifier);
        const getSubscription = await handleGetSubscription(getUser.subscriptionId);

        if (getSubscription.status === "authenticated" || getSubscription.status === "active") {
          await setActive({ session: signInAttempt.createdSessionId })
          router.push('/')
        } else if (getSubscription.status === "created") {
          setError({
            field: 'unknown',
            message: 'Your Subscription has just been created please try after it was authenticated',
          })
        } else {
          setLoadRazorpay(true);
          const response = await axios.post("/api/create-subscription", { customerId: getUser.customerId });
          const data = response.data;

          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            subscription_id: data.subscriptionId,
            name: "Streamix",
            description: "monthly",
            handler: async function (response: any) {
              try {
                if (response.razorpay_subscription_id) {
                  const subscriptionStatus = await handleGetSubscription(response.razorpay_subscription_id);
                  if (['active', 'authenticated', 'created'].includes(subscriptionStatus.status)) {
                    await axios.post('/api/update-subscription', {
                      emailAddress: signInAttempt.identifier,
                      subscriptionId: response.razorpay_subscription_id,
                    });
                    await setActive({ session: signInAttempt.createdSessionId });
                    router.push('/');
                  } else {
                    setError({
                      field: 'unknown',
                      message: 'Failed to verify subscription',
                    });
                    console.log(subscriptionStatus);
                  }
                } else {
                  setError({
                    field: 'unknown',
                    message: 'Failed to create subscription',
                  });
                  console.log(response);
                }
              } catch (error) {
                console.error(error);
              }
            },
            prefill: {
              name: `${getUser?.firstName} ${getUser?.lastName}`,
              email: getUser?.emailAddress,
              contact: getUser.phone,
            },
            theme: {
              color: "#3399cc"
            },
          }

          const rzp1 = new window.Razorpay(options);
          rzp1.open();

        }
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
    setLoading(false);
  }, [isLoaded, signIn, setActive, router, handleGetUser, handleGetSubscription]);

  return (
    <section className="bg-blue-50 w-11/12 sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-1/2 max-w-lg mx-auto my-auto rounded-lg xl:rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 md:p-8 lg:p-10 xl:p-12 text-blue-500 relative">
      {loadRazorpay && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}
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
                <FaEyeSlash onClick={handleToggleShowPass} className="p-1 text-2xl my-auto h-full" />
              ) : (
                <FaEye onClick={handleToggleShowPass} className="p-1 text-2xl my-auto h-full" />
              )}
            </span>
          </div>
          {errors.password && <span className="-mt-1 text-red-500">{errors.password.message}</span>}
          {error?.field === 'password' && <span className="-mt-1 text-red-500">{error?.message}</span>}
          <Link href='/forgot-password'><span className='text-sm lg:text-base text-blue-500'>Forgot Password?</span></Link>
        </div>
        {loading ? (
          <div role="status" className='w-full bg-blue-500 flex items-center justify-center rounded-md py-2'>
            <svg aria-hidden="true" className="w-8 h-8 text-gray-300 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <input className='bg-blue-500 text-blue-50 font-semibold cursor-pointer p-2 w-full text-center rounded-md' type="submit" value="Continue" />
        )}
      </form>
      <hr className='w-full border border-blue-500 mt-6 mb-4' />
      <span className="w-full block text-center">Don&apos;t have an account? <Link href='/sign-up'><strong className='cursor-pointer'>Sign Up</strong></Link></span>
    </section>
  )
}

export default SignInForm;