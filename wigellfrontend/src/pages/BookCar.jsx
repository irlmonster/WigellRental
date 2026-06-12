import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CarCard from '../components/CarCard'
import '../styles/BookCar.css'

export default function BookCar() {
  const [availableCars, setAvailableCars] = useState([])
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange

  const auth = localStorage.getItem('auth')
  const user = JSON.parse(localStorage.getItem('user'))

  // Hämta lediga bilar från BACKEND när två datum valts
  async function fetchAvailableCars(start, end) {
    const from = start.toISOString().split('T')[0]
    const to = end.toISOString().split('T')[0]

    try {
      const response = await fetch(
        `/api/v1/cars/available?from=${from}&to=${to}`,
        {
          headers: {
            Authorization: 'Basic ' + auth,
          },
        }
      )

      if (!response.ok) {
        console.error('Kunde inte hämta lediga bilar')
        setAvailableCars([])
        return
      }

      const data = await response.json()
      setAvailableCars(data)
    } catch (err) {
      console.error('Fel vid hämtning av lediga bilar', err)
      setAvailableCars([])
    }
  }

  // Antal dagar
  function getTotalDays() {
    if (!startDate || !endDate) return 0

    const diff =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)

    return diff > 0 ? Math.ceil(diff) : 0
  }

  const totalDays = getTotalDays()

  // När användaren väljer datum
  function handleDateChange(update) {
    setDateRange(update)

    const [start, end] = update

    if (start && end) {
      fetchAvailableCars(start, end)
    }
  }

  return (
    <div className="page-fade">
      <div className="bookcar-page">
        <h1>Boka bil</h1>

        <h3>Välj datum</h3>

        <div className="datepicker-wrapper">
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            inline
          />
        </div>

        {!startDate || !endDate ? (
          <p className="bookcar-info-text">
            Välj ett datumintervall för att se lediga bilar.
          </p>
        ) : (
          <div className="car-results">
            <h2>Lediga bilar ({totalDays} dagar)</h2>

            <div className="car-list">
              {availableCars.length === 0 && (
                <p className="bookcar-info-text">
                  Inga bilar lediga för valt datum.
                </p>
              )}

              {availableCars.map(car => (
                <CarCard
                  key={car.id}
                  car={car}
                  totalDays={totalDays}
                  totalPrice={car.price * totalDays}
                  startDate={startDate}
                  endDate={endDate}
                  user={user}
                  auth={auth}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
