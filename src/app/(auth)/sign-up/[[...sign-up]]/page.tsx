import { SignUp } from '@clerk/nextjs'
import React from 'react'

export default function Page() {
    return (
        <div className=" grid">
            <div className="flex flex-col justify-center items-center p-4 sm:p-12">

                <SignUp />
            </div>
        </div>
    )
}
