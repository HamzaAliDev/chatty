import React from 'react'
import { UserProfile } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className=" grid">
            <div className="flex flex-col justify-center items-center p-4 sm:p-12">
                <UserProfile routing="hash" />
            </div>
        </div>
    )
}
