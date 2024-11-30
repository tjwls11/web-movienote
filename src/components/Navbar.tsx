'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { FiAlignJustify } from 'react-icons/fi'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'

export default function Naver() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 py-6 px-8 flex items-center justify-between z-30 text-green-700">
        <div className="text-green-700 font-mono text-2xl">
          <Link href=".">MOVIENOTE</Link>
        </div>
        <div className="hidden lg:flex space-x-4">
          <div className="flex gap-4 items-center">
            <div>
              <Link href="/movie">MOVIE</Link>
            </div>
            {status === 'authenticated' ? (
              <>
                <div className="flex gap-2 items-center">
                  <Image
                    className="rounded-full"
                    src={session?.user?.image ?? '/default-avatar.png'}
                    width={40}
                    height={40}
                    alt={session?.user?.name ?? 'user'}
                  />
                  <span className="text-white font-bold">
                    {session?.user?.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-lg font-bold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-lg font-bold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-green-700"
          >
            <FiAlignJustify size={24} />
          </button>
        </div>
      </nav>

      {/* 조건부 메뉴 표시 - 모바일 메뉴 */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col space-y-2 mt-4">
          <div className="flex gap-4 items-center">
            {status === 'authenticated' ? (
              <>
                <div className="flex gap-2 items-center">
                  <Image
                    className="rounded-full"
                    src={session?.user?.image ?? '/default-avatar.png'}
                    width={40}
                    height={40}
                    alt={session?.user?.name ?? 'user'}
                  />
                  <span className="text-white font-bold">
                    {session?.user?.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-lg font-bold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-lg font-bold"
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
