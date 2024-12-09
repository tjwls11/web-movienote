'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { FiAlignJustify } from 'react-icons/fi'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { VscSignOut } from 'react-icons/vsc'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  const getProfileImage = () => {
    return session?.user?.image || '/default-avatar.png'
  }

  return (
    <div className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto py-4 px-8 flex items-center justify-between">
        <div className="text-[#2d5a27] font-mono text-2xl font-bold hover:text-[#1a3517] transition-colors">
          <Link href="/">MOVIENOTE</Link>
        </div>

        {status === 'authenticated' ? (
          <div className="flex items-center gap-6">
            <Link href="/mypage">
              <Image
                className="rounded-full cursor-pointer ring-2 ring-[#2d5a27] hover:ring-[#1a3517] transition-colors"
                src={getProfileImage()}
                width={40}
                height={40}
                alt={session.user?.name || 'user'}
              />
            </Link>
            <button
              onClick={handleSignOut}
              className="text-[#2d5a27] hover:text-[#1a3517] transition-colors"
            >
              <VscSignOut size={24} />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-[#2d5a27] hover:bg-[#1a3517] text-white px-6 py-2 rounded-md text-lg font-medium transition-colors"
          >
            Login
          </Link>
        )}
      </nav>

      <div className="lg:hidden px-8">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-[#2d5a27]"
        >
          <FiAlignJustify size={24} />
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden flex flex-col space-y-2 p-4 bg-white shadow-lg mt-2">
          <div className="flex gap-4 items-center">
            {status === 'authenticated' ? (
              <>
                <Link href="/mypage">
                  <div className="flex gap-2 items-center cursor-pointer">
                    <Image
                      className="rounded-full ring-2 ring-[#2d5a27]"
                      src={getProfileImage()}
                      width={40}
                      height={40}
                      alt={session.user?.name || 'user'}
                    />
                    <span className="text-[#2d5a27] font-medium">
                      {session.user?.name}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-[#2d5a27] hover:bg-[#1a3517] text-white px-4 py-2 rounded-md text-lg font-medium transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-[#2d5a27] hover:bg-[#1a3517] text-white px-4 py-2 rounded-md text-lg font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
