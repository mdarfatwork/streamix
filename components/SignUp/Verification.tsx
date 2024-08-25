"use client"
import React, { useState, useCallback } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from "react-hook-form"
import Script from "next/script";
import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FormInput {
  code: string
}

interface Subscription {
  status: string;
}

const Verification = ({ phone }: { phone: string }) => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormInput>()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleVerify = useCallback(async (subscriptionId: string): Promise<Subscription> => {
    const response = await axios.post("/api/fetch-subscription", { subscriptionId });
    return response.data.subscription as Subscription;
  }, []);

  const createRazorpayCustomer = useCallback(async (email: string | null, phone: string) => {
    try {
      const response = await axios.post("/api/create-customer", { email, phone });
      return response.data.customerId;
    } catch (error) {
      console.error("Failed to create Razorpay customer", error);
      throw new Error("Failed to create Razorpay customer");
    }
  }, []);

  const onSubmit: SubmitHandler<FormInput> = useCallback(async (data) => {
    if (!isLoaded) return
    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code,
      })

      if (completeSignUp.status === 'complete') {
        if (!phone) throw new Error("Contact number is required for OTP");

        const customerId = await createRazorpayCustomer(completeSignUp.emailAddress, phone);

        // Payment
        const response = await axios.post("/api/create-subscription", { customerId });
        const data = response.data;

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          subscription_id: data.subscriptionId,
          name: "Streamix",
          description: "monthly",
          handler: async function (response: any) {
            try {
              // console.log(response?.razorpay_subscription_id);
              if (response.razorpay_subscription_id) {
                const subscriptionStatus = await handleVerify(response.razorpay_subscription_id);
                if (subscriptionStatus.status === 'active' || subscriptionStatus.status === 'authenticated' || subscriptionStatus.status === 'created') {
                  await setActive({ session: completeSignUp.createdSessionId })
                  await axios.post('/api/sign-up', {
                    createdUserId: completeSignUp?.createdUserId,
                    firstName: completeSignUp?.firstName,
                    lastName: completeSignUp?.lastName,
                    emailAddress: completeSignUp?.emailAddress,
                    phone: phone,
                    subscriptionId: response.razorpay_subscription_id,
                    customerId: customerId,
                  });
                  router.push('/')
                } else {
                  setError("Failed to verify subscription")
                  console.log(subscriptionStatus);
                }
              } else {
                setError("Failed to create subscription")
                console.log(response);
              }
            } catch (error) {
              console.error(error)
            }
          },
          prefill: {
            name: `${completeSignUp?.firstName} ${completeSignUp?.lastName}`,
            email: completeSignUp?.emailAddress,
            contact: phone,
          },
          theme: {
            color: "#3399cc"
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
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
  }, [isLoaded, signUp, setActive, router, phone, handleVerify, createRazorpayCustomer]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setValue('code', value, { shouldValidate: true });
  }, [setValue]);

  return (
    <section className="bg-blue-50 w-11/12 sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-1/2 max-w-md mx-auto my-auto rounded-lg xl:rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 md:p-8 lg:p-10 xl:p-12 text-blue-500">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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
        <input className='bg-blue-500 text-blue-50 font-semibold cursor-pointer p-2 w-full text-center rounded-md' type="submit" value="Continue and Pay &#8377;199/Month" />
      </form>
    </section>
  )
}

export default Verification;