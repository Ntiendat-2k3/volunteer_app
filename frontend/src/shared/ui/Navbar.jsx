import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        display: 'flex',
        padding: '12px 24px',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eee'
      }}
    >
      <div>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
          Volunteer Hub
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {user ? (
          <>
            <span>Xin chào, {user.full_name}</span>
            <button onClick={logout}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
}
