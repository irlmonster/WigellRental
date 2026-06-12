import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import '../styles/LoginSection.css'

export default function LoginSection() {
  const auth = localStorage.getItem('auth')
  const isLoggedIn = !!auth

  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="login-section">
      {!isLoggedIn && (
        <>
          <input
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <LoginButton username={username} password={password} />

          <button onClick={() => navigate('/register')}>Skapa konto</button>
        </>
      )}

      {isLoggedIn && <LogoutButton />}
    </div>
  )
}
