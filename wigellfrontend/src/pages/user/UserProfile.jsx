import { useState, useEffect } from 'react'
import EditUserModal from '../../components/EditUserModal'

export default function UserProfile() {
  const auth = localStorage.getItem('auth')
  const storedUser = JSON.parse(localStorage.getItem('user')) // innehåller id
  const [currentUser, setCurrentUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(
        `/api/v1/users/${storedUser.id}`,
        {
          headers: { Authorization: 'Basic ' + auth },
        }
      )

      if (res.ok) {
        const data = await res.json()
        setCurrentUser(data)

        // Uppdatera localStorage så profilen alltid är aktuell
        localStorage.setItem('user', JSON.stringify(data))
      }
    }

    fetchUser()
  }, [auth, storedUser.id])

  if (!currentUser) return <p>Laddar profil...</p>

  return (
    <div className="page-fade">
      <div style={{ padding: '20px' }}>
        <h1>Min profil</h1>

        <p>
          <b>Förnamn:</b> {currentUser.firstName}
        </p>
        <p>
          <b>Efternamn:</b> {currentUser.lastName}
        </p>
        <p>
          <b>Användarnamn:</b> {currentUser.username}
        </p>
        <p>
          <b>Email:</b> {currentUser.email}
        </p>
        <p>
          <b>Telefon:</b> {currentUser.phone}
        </p>

        <button className="edit-btn" onClick={() => setIsEditing(true)}>
          Redigera min profil
        </button>

        {isEditing && (
          <EditUserModal
            user={currentUser}
            onClose={() => setIsEditing(false)}
            onUpdated={() => {
              // Läs om usern efter ändring
              const updated = JSON.parse(localStorage.getItem('user'))
              setCurrentUser(updated)
            }}
            isAdmin={false}
          />
        )}
      </div>
    </div>
  )
}
