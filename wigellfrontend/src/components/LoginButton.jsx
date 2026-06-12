export default function LoginButton({ username, password, onSuccess }) {
  async function handleLogin() {
    try {
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
        alert('Fel användarnamn eller lösenord')
        return
      }

      const userFromBackend = await response.json()

      localStorage.setItem('auth', credentials)
      localStorage.setItem('user', JSON.stringify(userFromBackend))

      if (onSuccess) onSuccess(userFromBackend)

      window.location.href = '/'
    } catch (error) {
      console.error(error)
      alert('Serverfel')
    }
  }

  return (
    <button style={{ marginTop: '15px' }} onClick={handleLogin}>
      Logga in
    </button>
  )
}
