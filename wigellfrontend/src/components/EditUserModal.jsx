import { useState, useEffect } from 'react'

export default function EditUserModal({ user, onClose, onUpdated, isAdmin }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    role: '',
    noOfOrders: 0,
  })

  const auth = localStorage.getItem('auth')

  // Load initial values from selected user
  useEffect(() => {
    if (!user) return

    queueMicrotask(() => {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        phone: user.phone || '',
        email: user.email || '',
        password: '',
        role: user.role || 'ROLE_USER',
        noOfOrders: user.noOfOrders ?? 0,
      })
    })
  }, [user])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    if (!isAdmin && user.id !== JSON.parse(localStorage.getItem('user')).id) {
      alert('Du kan bara ändra ditt eget konto.')
      return
    }
    e.preventDefault()

    const body = {
      ...form,
      role: isAdmin ? form.role : user.role,
      password: form.password === '' ? user.password : form.password,
    }

    const res = await fetch(`/api/v1/users/${user.id}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Basic ' + auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      await onUpdated()
      onClose()
    } else {
      alert('Kunde inte uppdatera användaren.')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-fade">
        <div className="modal">
          <h2>Redigera användare – {user.username}</h2>

          <form onSubmit={handleSubmit}>
            <label>Namn</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />

            <label>Efternamn</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />

            <label>Användarnamn</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              disabled={!isAdmin}
            />

            <label>Telefon</label>
            <input name="phone" value={form.phone} onChange={handleChange} />

            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />

            <label>Nytt Lösenord (frivilligt)</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button type="submit">Spara</button>
              <button type="button" onClick={onClose}>
                Avsluta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
