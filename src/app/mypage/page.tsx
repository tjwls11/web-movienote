'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect } from 'react'

export default function MyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20">
      <div className="w-full max-w-sm shadow-2xl drop-shadow-2xl rounded-lg p-8 border-t border-gray-300">
        <div className="flex flex-col items-center">
          <Image
            src={session.user.image || '/default-avatar.png'}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full mb-4 ring-2 ring-[#2d5a27]"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {session.user.name}
          </h2>
          <p className="text-gray-600 mb-4">{session.user.email}</p>
        </div>
      </div>
    </div>
  )
}
