"use client"
import React, { useState } from 'react'
import PasswordCodeForm from './PasswordCodeForm';
import EmailForm from './EmailForm';

const ForgotPasswordFlow = () => {
  const [successfulCreation, setSuccessfulCreation] = useState(false);

  const handleOnSend = (data: boolean) => setSuccessfulCreation(data)
  return (
    <section className="bg-blue-50 w-11/12 sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-1/2 max-w-lg mx-auto my-auto rounded-lg xl:rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 md:p-8 lg:p-10 xl:p-12 text-blue-500 relative">
      <h2 className='text-lg text-center font-semibold'>Forgot Password?</h2>
      {successfulCreation ? (
        <PasswordCodeForm/>
      ) : (
        <EmailForm onSend={handleOnSend}/>
      )}
    </section>
  )
}

export default ForgotPasswordFlow
