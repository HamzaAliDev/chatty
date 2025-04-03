import { UserProfile } from '@clerk/nextjs'
import React from 'react'

export default function Page() {
    return (
        <div className='container flex items-center justify-center sm:p-4  py-10 lg:justify-center'>
            <UserProfile routing="hash" />
        </div>
    )
}
