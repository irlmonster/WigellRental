import { Link } from 'react-router-dom'
import LoginSection from './LoginSection'

export default function Navigation() {
  const auth = localStorage.getItem('auth')
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null

  const isLoggedIn = !!auth
  const isAdmin = user?.isAdmin === true

  return (
    <nav className="nav-container">
      <ul>
        <li>
          <Link to="/">Hem</Link>
        </li>

        <li>
          <Link to="/cars">Våra bilar</Link>
        </li>

        {isLoggedIn && (
          <>
            <li>
              <Link to="/bookings">Bokningar</Link>
            </li>
            <li>
              <Link to="/bookcar">Boka en bil</Link>
            </li>
            <li>
              <Link to="/userprofile">Min Profil</Link>
            </li>
          </>
        )}

        {isAdmin && (
          <>
            <li>
              <Link to="/admin/users">Admin – Användare</Link>
            </li>
            <li>
              <Link to="/admin/cars">Admin – Bilar</Link>
            </li>
            <li>
              <Link to="/admin/bookings">Admin – Bokningar</Link>
            </li>
          </>
        )}
      </ul>

      <LoginSection />
    </nav>
  )
}
