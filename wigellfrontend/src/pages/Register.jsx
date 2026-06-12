import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Register.css'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const res = await fetch('/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      alert('Konto skapat!')
      navigate('/')
    } else {
      alert('Kunde inte skapa konto.')
    }
  }

  return (
    <div className="page-fade">
      <div className="register-wrapper">
        <div className="card register-box">
          <h2>Skapa konto</h2>

          <form onSubmit={handleSubmit}>
            <label>Förnamn</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />

            <label>Efternamn</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />

            <label>Användarnamn</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Telefon</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <label>Lösenord</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="register-btn">
              Skapa konto
            </button>
            <button
              type="button"
              className="register-cancel-btn"
              onClick={() => navigate('/')}
            >
              Avbryt
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
