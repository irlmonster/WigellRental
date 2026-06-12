import { useState } from 'react'
import '../styles/AddUserModal.css'

export default function AddUserModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    role: 'ROLE_USER',
  })

  const auth = localStorage.getItem('auth')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const body = {
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      phone: form.phone,
      email: form.email,
      password: form.password,
      role: form.role,
    }

    const res = await fetch('/api/v1/users', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      await onAdded()
      onClose()
    } else {
      alert('Kunde inte skapa användaren.')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-fade">
        <div className="modal">
          <h2>Lägg till användare</h2>

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
            />

            <label>Telefon</label>
            <input name="phone" value={form.phone} onChange={handleChange} />

            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />

            <label>Lösenord</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button type="submit">Lägg till</button>
              <button type="button" onClick={onClose}>
                Avbryt
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
