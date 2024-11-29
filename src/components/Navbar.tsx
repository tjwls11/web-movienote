'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { FiAlignJustify } from 'react-icons/fi'

export default function Naver() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 py-6 px-8 flex items-center justify-between z-30  text-green-700">
        <div className="text-green-700 font-mono text-2xl">
          <Link href=".">MOVIENOTE</Link>
        </div>
        <div className="hidden lg:flex space-x-4 ">
          <Link href="/about" className="hover:text-green-500 transition">
            Movie
          </Link>
          <Link href="/study" className="hover:text-green-500 transition">
            Community
          </Link>
          <Link href="/project" className="hover:text-green-500 transition">
            My Profile
          </Link>
          <Link
            href="/login"
            className="inline-block bg-green-900 text-white font-bold py-2 px-6 rounded-full hover:bg-green-700 transition-colors"
          >
            로그인
          </Link>
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
    </div>
  )
}
