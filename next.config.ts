/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org', // 호스트 이름
        port: '',
        pathname: '/t/p/w500/**', // 필요한 경로 패턴
      },
    ],
    domains: ['image.tmdb.org'], // TMDB 이미지 호스트 추가
  },
}

export default nextConfig