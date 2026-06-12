import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    const credentials = btoa(username + ':' + password)

    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + credentials,
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      setError('Fel användarnamn eller lösenord')
      return
    }

    const userFromBackend = await response.json()

    // Spara token + user-info i localStorage
    localStorage.setItem('auth', credentials)
    localStorage.setItem('user', JSON.stringify(userFromBackend))

    // Skicka uppåt till App om du använder props
    if (onLogin) onLogin(credentials, userFromBackend)

    navigate('/')
  }

  return (
    <div>
      <h2>Logga in</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Användarnamn:</label>
          <input value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Lösenord:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button>Logga in</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
