'use client'

import Link from 'next/link'
import React, { useState } from 'react'

export default function SignPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)

    // 유효성 검사: 최소 8자, 하나 이상의 숫자 포함
    if (value.length < 8 || !/\d/.test(value)) {
      setPasswordError(
        '비밀번호는 최소 8자 이상이어야 하며 숫자를 포함해야 합니다.'
      )
    } else {
      setPasswordError('')
    }
  }

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setConfirmPassword(value)

    // 비밀번호와 동일한지 확인
    if (value !== password) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.')
    } else {
      setConfirmPasswordError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordError && !confirmPasswordError) {
      try {
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        })

        const data = await res.json()

        if (res.ok) {
          setSuccessMessage('회원가입이 성공적으로 완료되었습니다.')
        } else {
          setErrorMessage(data.message || '회원가입에 실패했습니다.')
        }
      } catch (error) {
        setErrorMessage('서버 오류가 발생했습니다.')
      }
    } else {
      alert('입력 정보를 다시 확인해주세요.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20">
      <div className="w-full max-w-sm shadow-2xl drop-shadow-2xl rounded-lg p-8 border-t border-gray-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          회원가입
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="st_name"
              className="block text-sm font-medium text-gray-700"
            >
              이름
            </label>
            <input
              type="text"
              name="st_name"
              id="st_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="이름"
            />
          </div>
          <div>
            <label
              htmlFor="st_email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              type="text"
              name="st_email"
              id="st_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="이메일"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="비밀번호"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="비밀번호 확인"
            />
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            회원가입
          </button>
        </form>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm mt-4 text-center">
            {successMessage}
          </p>
        )}
        <Link
          href="/login"
          className="text-sm font-medium text-gray-700 mt-4 block text-center"
        >
          로그인
        </Link>
      </div>
    </div>
  )
}
