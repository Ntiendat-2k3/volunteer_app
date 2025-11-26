import { useNavigate, Link } from "react-router-dom"
import LoginForm from "../../features/auth/components/LoginForm"
import Card from "../../shared/ui/Card"

export default function LoginPage() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6 shadow-lg bg-white rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        <LoginForm onSuccess={handleSuccess} />
        <div className="mt-4 text-center text-sm">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </Card>
    </div>
  )
}
