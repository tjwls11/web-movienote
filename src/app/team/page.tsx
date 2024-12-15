import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface TeamMember {
  name: string
  role: string
  portfolio: string
  github: string
  image: string
}

const teamMembers: TeamMember[] = [
  {
    name: '김건희',
    role: 'Frontend Developer',
    portfolio: 'https://portfolio1.com',
    github: 'https://github.com/000712',
    image: '/team/geonhee.jpg',
  },
  {
    name: '김혜정',
    role: 'Frontend Developer',
    portfolio: 'https://portfolio1.com',
    github: 'https://github.com/hyejeong22',
    image: '/team/hyejeong.png',
  },

  {
    name: '백서진',
    role: 'Frontend Developer',
    portfolio: 'https://portfolio1.com',
    github: 'https://github.com/tjwls11 ',
    image: '/team/seojin.png',
  },

  {
    name: '정은미',
    role: '토스뱅크 1000-5967-0362',
    portfolio: 'https://portfolio1.com',
    github: 'https://github.com/Eunmi04',
    image: '/team/eunmi.jpg',
  },
]

// 기술 스택 데이터 추가
const techStack = {
  frontend: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React Query'],
  deployment: ['Vercel'],
  tools: ['Git', 'GitHub', 'Miro', 'Figma'],
}

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4">
      {/* 팀 소개 섹션 */}
      <section className="py-32">
        <h1 className="text-4xl font-bold text-center mb-24">GoyangHub Team</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 px-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-8">
              <div className="relative w-full aspect-square mb-8">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,25vw"
                  className="rounded-lg object-cover"
                  priority={index < 2}
                />
              </div>
              <h2 className="text-xl font-semibold mb-4">{member.name}</h2>
              <p className="text-gray-600 mb-8">{member.role}</p>
              <div className="space-y-4">
                <Link
                  href={member.portfolio}
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                  target="_blank"
                >
                  포트폴리오
                </Link>
                <Link
                  href={member.github}
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                  target="_blank"
                >
                  GitHub
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 팀 활동 과정 섹션 */}
      <section className="py-24">
        <h2 className="text-3xl font-bold text-center mb-16">Our Journey</h2>

        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">기획 단계</h3>
            <Image src="/miro.png" alt="miro" width={500} height={200} />
            <Image src="/diagram.jpg" alt="diagram" width={500} height={200} />
            <p className="text-gray-600 leading-relaxed">
              miro 사이트를 이용해 공동작업하여 프로젝트를 기획하였습니다
              <br />
              페이지별 기능 정리, 다이어그램, UML 제작을 진행하였습니다
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">개발 과정</h3>
            <Image src="/fork.png" alt="git" width={200} height={100} />
            <p className="text-gray-600 leading-relaxed">
              Git fork를 이용해 코드를 병합하였습니다
            </p>
          </div>
        </div>
      </section>

      {/* 기술 스택 섹션 추가 */}
      <section className="py-24">
        <h2 className="text-3xl font-bold text-center mb-16">Tech Stack</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(techStack).map(([category, technologies]) => (
            <div key={category} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-2">
                {technologies.map((tech) => (
                  <li key={tech} className="text-gray-600">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}