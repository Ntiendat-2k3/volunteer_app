"use client"

import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import Button from "../../../shared/ui/Button"
import Input from "../../../shared/ui/Input"

export default function LoginForm({ onSuccess }) {
  const { login, isLoading, error } = useAuth()
  const [form, setForm] = useState({ email: "", password: "" })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(form)
      if (onSuccess) onSuccess()
    } catch (err) {
      // Error is handled in hook and displayed below
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          name="email"
          type="email"
          placeholder="nhap@email.com"
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

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Đang xử lý..." : "Đăng nhập"}
      </Button>
    </form>
  )
}
