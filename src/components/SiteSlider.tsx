'use client'

import { useState } from 'react'
import { TbDeviceTvOld } from 'react-icons/tb'
import { MdMovieEdit } from 'react-icons/md'
import { IoTicketOutline } from 'react-icons/io5'
import Link from 'next/link'

const ottSites = [
  { name: 'Netflix', url: 'https://www.netflix.com' },
  { name: 'Watcha', url: 'https://www.watcha.com' },
  { name: 'Wavve', url: 'https://www.wavve.com' },
  { name: 'Disney+', url: 'https://www.disneyplus.com' },
  { name: 'Tving', url: 'https://www.tving.com' },
]

const ticketingSites = [
  { name: 'CGV', url: 'https://www.cgv.co.kr' },
  { name: '메가박스', url: 'https://www.megabox.co.kr' },
  { name: '롯데시네마', url: 'https://www.lottecinema.co.kr' },
]

export default function SiteSlider() {
  const [showOtt, setShowOtt] = useState(false)
  const [showTicketing, setShowTicketing] = useState(false)

  return (
    <div className="w-full">
      {/* OTT 슬라이더 */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-lg transition-transform duration-300 ${
          showOtt ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#2d5a27] scrollbar-track-gray-100">
            {ottSites.map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[200px] bg-white rounded-xl p-4 text-center font-medium shadow-md hover:-translate-y-1 hover:shadow-xl transition-all text-[#2d5a27] hover:text-[#1a3517] ring-1 ring-[#2d5a27]/10"
              >
                {site.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 예매 사이트 슬라이더 */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-lg transition-transform duration-300 ${
          showTicketing ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#2d5a27] scrollbar-track-gray-100">
            {ticketingSites.map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[200px] bg-white rounded-xl p-4 text-center font-medium shadow-md hover:-translate-y-1 hover:shadow-xl transition-all text-[#2d5a27] hover:text-[#1a3517] ring-1 ring-[#2d5a27]/10"
              >
                {site.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex justify-center gap-8 sm:gap-16 w-full">
        <Link href="/board">
          <button className="group flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#2d5a27] rounded-full flex items-center justify-center hover:bg-[#1a3517] transition-colors shadow-lg hover:shadow-xl text-white text-4xl">
              <MdMovieEdit />
            </div>
            <span className="mt-2 text-base sm:text-lg font-medium text-[#2d5a27]">
              커뮤니티
            </span>
          </button>
        </Link>

        <button
          className="group flex flex-col items-center"
          onClick={() => {
            setShowOtt(!showOtt)
            setShowTicketing(false)
          }}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#2d5a27] rounded-full flex items-center justify-center hover:bg-[#1a3517] transition-colors shadow-lg hover:shadow-xl text-white text-4xl">
            <TbDeviceTvOld />
          </div>
          <span className="mt-2 text-base sm:text-lg font-medium text-[#2d5a27]">
            OTT
          </span>
        </button>

        <button
          className="group flex flex-col items-center"
          onClick={() => {
            setShowTicketing(!showTicketing)
            setShowOtt(false)
          }}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#2d5a27] rounded-full flex items-center justify-center hover:bg-[#1a3517] transition-colors shadow-lg hover:shadow-xl text-white text-4xl">
            <IoTicketOutline />
          </div>
          <span className="mt-2 text-base sm:text-lg font-medium text-[#2d5a27]">
            예매사이트
          </span>
        </button>
      </div>
    </div>
  )
}