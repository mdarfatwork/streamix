"use client"
import axios from 'axios';
import React from 'react'

const page = () => {
    const handleVerify = async (subscriptionId: string)=> {
        const response = await axios.post("/api/fetch-subscription", { subscriptionId });
        console.log(response.data.subscription)
      };
  return (
    <div onClick={()=>handleVerify("sub_OnQYGr4dQO8O9J")}>
      on Click to test
    </div>
  )
}

export default page
