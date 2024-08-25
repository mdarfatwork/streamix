"use client"
import React, { useState } from 'react'
import Verification from './Verification'
import SignUpForm from './SignUpForm'

interface OnSend {
    isSuccess: boolean;
    phone: string
}

const SignUpFlow = () => {
    const [verifying, setVerifying] = useState<boolean>(false)
    const [phoneNumber, setPhoneNumber] = useState<string>("")

    const handleOnSendSignUP = (data: OnSend) => {
        setVerifying(data.isSuccess)
        setPhoneNumber(data.phone)
    }

    return (
        <>
            {!verifying ? <SignUpForm onSend={handleOnSendSignUP} /> : <Verification phone={phoneNumber} />}
        </>
    )
}

export default SignUpFlow;