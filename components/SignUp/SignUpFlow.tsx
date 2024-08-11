"use client"
import React, { useState } from 'react'
import Verification from '@/components/SignUp/Verification'
import SignUpForm from '@/components/SignUp/SignUpForm'

const SignUpFlow = () => {
    const [verifying, setVerifying] = useState<boolean>(false)

    const handleOnSend = (data: boolean) => setVerifying(data)

    return (
        <>
            {verifying ? (
                <Verification />
            ) : (
                <SignUpForm onSend={handleOnSend} />
            )}
        </>
    )
}

export default SignUpFlow
