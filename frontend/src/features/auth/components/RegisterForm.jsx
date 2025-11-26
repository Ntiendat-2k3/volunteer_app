"use client"

import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import Button from "../../../shared/ui/Button"
import Input from "../../../shared/ui/Input"

export default function RegisterForm({ onSuccess }) {
  const { register, isLoading, error } = useAuth()
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(form)
      if (onSuccess) onSuccess()
    } catch (err) {
      // Error handled in hook
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Họ tên</label>
        <Input name="full_name" placeholder="Nguyễn Văn A" value={form.full_name} onChange={handleChange} required />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          name="email"
          type="email"
          placeholder="email@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Mật khẩu</label>
        <Input
          name="password"
          type="password"
          placeholder="******"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Số điện thoại</label>
        <Input name="phone" placeholder="0901234567" value={form.phone} onChange={handleChange} />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Đang xử lý..." : "Đăng ký"}
      </Button>
    </form>
  )
}
