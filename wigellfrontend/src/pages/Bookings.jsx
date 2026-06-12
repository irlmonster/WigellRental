import { useState, useEffect } from 'react'
import '../styles/Bookings.css'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [cars, setCars] = useState({})
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState('none')

  const auth = localStorage.getItem('auth')

  // === STEG 1: Hämta alla bokningar för inloggad user ===
  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch(
          '/api/v1/bookings/me',
          {
            headers: {
              Authorization: 'Basic ' + auth,
            },
          }
        )

        if (!response.ok) {
          console.error('Kunde inte hämta bokningar')
          setLoading(false)
          return
        }

        const data = await response.json()
        setBookings(data)
      } catch (error) {
        console.error('Fel vid hämtning av bokningar:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [auth])

  // === STEG 2: Hämta info om bilarna som är kopplade till bokningarna ===
  useEffect(() => {
    async function loadCars() {
      for (const booking of bookings) {
        const carId = booking.carId

        // Om bilen redan är hämtad — hoppa över
        if (cars[carId]) continue

        try {
          const response = await fetch(
            `/api/v1/cars/${carId}`,
            {
              headers: {
                Authorization: 'Basic ' + auth,
              },
            }
          )

          if (!response.ok) continue

          const car = await response.json()

          setCars(prev => ({
            ...prev,
            [carId]: car,
          }))
        } catch (error) {
          console.error('Fel vid hämtning av bil:', error)
        }
      }
    }

    if (bookings.length > 0) {
      loadCars()
    }
  }, [bookings, cars, auth])

  if (loading) return <p>Laddar dina bokningar...</p>

  function getSortedBookings() {
    const sorted = [...bookings]

    if (sortOrder === 'active') {
      sorted.sort((a, b) => Number(b.active) - Number(a.active))
    }

    if (sortOrder === 'inactive') {
      sorted.sort((a, b) => Number(a.active) - Number(b.active))
    }

    return sorted
  }

  return (
    <div className="page-fade">
      <div className="bookings-page">
        <h1>Mina bokningar</h1>

        {bookings.length === 0 && <p>Du har inga bokningar.</p>}

        <div className="sort-buttons">
          <button onClick={() => setSortOrder('active')}>Aktiva först</button>
          <button onClick={() => setSortOrder('inactive')}>
            Inaktiva först
          </button>
        </div>

        <div className="bookings-list">
          {getSortedBookings().map(booking => {
            const car = cars[booking.carId]

            return (
              <div className="card booking-card">
                <h3>Bokning #{booking.id}</h3>

                {/* Bil-info */}
                {car ? (
                  <>
                    <p>
                      <b>Bil:</b> {car.name} ({car.model})
                    </p>

                    {car.image && (
                      <img
                        src={`data:image/jpeg;base64,${car.image}`}
                        alt={car.name}
                      />
                    )}
                  </>
                ) : (
                  <p>Laddar bilinformation...</p>
                )}

                {/* Datum */}
                <p>
                  <b>Från:</b> {booking.fromDate}
                </p>
                <p>
                  <b>Till:</b> {booking.toDate}
                </p>

                {/* Status */}
                <p>
                  <b>Status:</b>{' '}
                  <span
                    className={
                      booking.active
                        ? 'status-tag status-active'
                        : 'status-tag status-ended'
                    }
                  >
                    {booking.active ? 'Aktiv' : 'Avslutad'}
                  </span>
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
