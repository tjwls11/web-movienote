import Link from 'next/link'
import { IoPeople } from 'react-icons/io5'
import { FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © 2024 MovieNote. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/team"
              className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
            >
              <IoPeople className="text-xl" />
              Team
            </Link>
            <Link
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
            >
              <FaGithub className="text-xl" />
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}