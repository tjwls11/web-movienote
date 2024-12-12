import Link from 'next/link'
import { FaGithub, FaYoutube } from 'react-icons/fa'
import { IoPeople } from 'react-icons/io5'

export default function Footer() {
  return (
    <footer className="bg-[#2d5a27] text-white mt-5">
      <div className="max-w-6xl mx-auto sm:px-3 lg:px-8 py-6 flex flex-col items-center justify-center">
        <div className="flex gap-6 mb-3">
          <a
            href="https://github.com/tjwls11/web-movienote"
            className="hover:text-gray-100 inline-flex items-center gap-2 text-base"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-xl" />
            GitHub
          </a>
          <a
            href="https://youtu.be/LJEtyvKiSeE"
            className="hover:text-gray-100 inline-flex items-center gap-2 text-base"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube className="text-xl" />
            YouTube
          </a>
          <Link
            href="/team"
            className="hover:text-gray-100 inline-flex items-center gap-2 text-base"
          >
            <IoPeople className="text-xl" />
            Team
          </Link>
        </div>
        <p className="text-sm text-gray-300">
          © {new Date().getFullYear()} Movie Note. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
