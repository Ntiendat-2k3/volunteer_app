"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import RegisterForm from "../../features/auth/components/RegisterForm"
import Card from "../../shared/ui/Card"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [successMsg, setSuccessMsg] = useState("")

  const handleSuccess = () => {
    setSuccessMsg("Đăng ký thành công! Đang chuyển đến trang đăng nhập...")
    setTimeout(() => navigate("/login"), 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6 shadow-lg bg-white rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng ký tài khoản</h2>

        {successMsg ? (
          <div className="text-green-600 text-center py-4 font-medium">{successMsg}</div>
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}

        <div className="mt-4 text-center text-sm">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </div>
      </Card>
    </div>
  )
}
