export default function LogoutButton() {
  function handleLogout() {
    localStorage.removeItem('auth')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return <button onClick={handleLogout}>Logga ut</button>
}
