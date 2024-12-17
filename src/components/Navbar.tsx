'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session, status } = useSession()
  const [currentImage, setCurrentImage] = useState('/default-avatar.png')

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/user/profile')
          const data = await response.json()

          if (data.success) {
            setCurrentImage(data.user.image)
          }
        } catch (error) {
          console.error('Failed to fetch user info:', error)
        }
      }
    }

    fetchUserInfo()
  }, [session])

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  return (
    <div className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto py-4 px-8 flex items-center justify-between">
        <div className="text-[#2d5a27aa] font-mono text-2xl font-bold hover:text-[#1a3517] transition-colors">
          <Link href="/">MOVIENOTE</Link>
        </div>

        <div className="flex items-center gap-6">
          {status === 'authenticated' ? (
            <>
              <div className="flex items-center gap-4">
                <Link href="/movie" className="text-green-800 font-bold">
                  movie
                </Link>
                <Link href="/board" className="text-green-800 font-bold">
                  community
                </Link>
                <Link href="/memo" className="text-green-800 font-bold">
                  record
                </Link>
                <Link href="/mypage">
                  <Image
                    className="rounded-full cursor-pointer ring-2 ring-[#2d5a27] hover:ring-[#1a3517] transition-colors"
                    src={currentImage}
                    width={40}
                    height={40}
                    alt={session.user?.name || 'user'}
                    priority
                  />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-[#2d5a27] hover:bg-[#1a3517] text-white px-6 py-2 rounded-md text-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/movie" className="text-green-800 font-bold">
                movie
              </Link>
              <Link href="/board" className="text-green-800 font-bold">
                community
              </Link>
              <Link href="/memo" className="text-green-800 font-bold">
                record
              </Link>
              <Link
                href="/login"
                className="bg-[#2d5a27] hover:bg-[#1a3517] text-white px-6 py-2 rounded-md text-lg font-medium transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
