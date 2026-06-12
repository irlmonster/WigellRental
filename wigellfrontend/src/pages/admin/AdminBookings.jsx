import { useEffect, useState } from 'react'
import BookingTable from '../../components/BookingTable'
import EditBookingModal from '../../components/EditBookingModal'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' })

  const [isEditing, setIsEditing] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const auth = localStorage.getItem('auth')

  // Laddar bokningar + users (återanvänds efter ändringar)
  async function loadData() {
    try {
      const bookingsRes = await fetch('/api/v1/bookings', {
        headers: { Authorization: 'Basic ' + auth },
      })

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setBookings(bookingsData)
      } else {
        console.error('Misslyckades att hämta bokningar')
      }

      const usersRes = await fetch('/api/v1/users', {
        headers: { Authorization: 'Basic ' + auth },
      })

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      } else {
        console.error('Misslyckades att hämta users')
      }
    } catch (err) {
      console.error('Fel vid loadData:', err)
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // HÄMTA BOOKINGS
        const bookingsRes = await fetch(
          '/api/v1/bookings',
          {
            headers: { Authorization: 'Basic ' + auth },
          }
        )
        if (bookingsRes.ok) {
          setBookings(await bookingsRes.json())
        }

        // HÄMTA USERS
        const usersRes = await fetch('/api/v1/users', {
          headers: { Authorization: 'Basic ' + auth },
        })
        if (usersRes.ok) {
          setUsers(await usersRes.json())
        }
      } catch (err) {
        console.error('Fel vid fetchData:', err)
      }
    }

    fetchData()
  }, [auth])

  function getUsername(userId) {
    const user = users.find(u => u.id === userId)
    return user ? user.username : 'Unknown'
  }

  const enrichedBookings = bookings.map(b => ({
    ...b,
    username: getUsername(b.userId),
  }))

  function handleSort(columnKey) {
    let direction = 'asc'
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key: columnKey, direction })
  }

  const sortedBookings = [...enrichedBookings].sort((a, b) => {
    const valA = a[sortConfig.key]
    const valB = b[sortConfig.key]

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  function openEdit(booking) {
    setSelectedBooking(booking)
    setIsEditing(true)
  }

  async function saveBooking(updated) {
    const res = await fetch(
      `/api/v1/bookings/${updated.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + auth,
        },
        body: JSON.stringify(updated),
      }
    )

    if (res.ok) {
      setIsEditing(false)
      setSelectedBooking(null)
      await loadData()
    } else {
      alert('Kunde inte uppdatera bokningen.')
    }
  }

  async function handleReturn(id) {
    if (!window.confirm('Markera bokningen som returnerad?')) return

    const res = await fetch(
      `/api/v1/bookings/return/${id}`,
      {
        method: 'PUT',
        headers: { Authorization: 'Basic ' + auth },
      }
    )

    if (res.ok) {
      await loadData()
    } else {
      alert('Kunde inte returnera bilen')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Vill du ta bort bokningen?')) return

    const res = await fetch(`/api/v1/bookings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Basic ' + auth },
    })

    if (res.ok) {
      await loadData()
    } else {
      alert('Kunde inte ta bort bokningen')
    }
  }

  return (
    <div className="page-fade">
      <div style={{ padding: '20px' }}>
        <h1>Admin – Bokningar</h1>

        <BookingTable
          bookings={sortedBookings}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={openEdit}
          onReturn={handleReturn}
          onDelete={handleDelete}
        />

        {isEditing && (
          <EditBookingModal
            booking={selectedBooking}
            onClose={() => setIsEditing(false)}
            onSave={saveBooking}
          />
        )}
      </div>
    </div>
  )
}
