import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function SigninButton() {
  return (
    <div className="flex flex-col gap-4 items-center">
      {/* 구글 */}
      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        className="flex items-center justify-center gap-4 rounded-lg pl-3 mb-4 w-full"
      >
        <Image src="/google-logo.png" height={30} width={30} alt="google" />
        <span className="bg-[#2d5a27aa] text-white px-4 py-3 rounded-lg">
          Sign in with Google
        </span>
      </button>

      {/* 깃허브 */}
      <button
        onClick={() => signIn('github', { callbackUrl: '/' })}
        className="flex items-center justify-center gap-4 rounded-lg pl-3 mb-4 w-full"
      >
        <Image src="/github-logo.png" height={30} width={30} alt="github" />
        <span className="bg-[#2d5a27aa] text-white px-4 py-3 rounded-lg">
          Sign in with Github
        </span>
      </button>
    </div>
  )
}
