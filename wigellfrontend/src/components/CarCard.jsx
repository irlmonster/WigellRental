import '../styles/CarCard.css'

export default function CarCard({
  car,
  totalDays,
  totalPrice,
  startDate,
  endDate,
  user,
  auth,
}) {
  async function handleBook() {
    if (!user || !auth) {
      alert('Du måste vara inloggad')
      return
    }

    const bookingRequest = {
      carId: car.id,
      userId: user.id,
      fromDate: startDate.toISOString().slice(0, 10),
      toDate: endDate.toISOString().slice(0, 10),
    }

    const res = await fetch('/api/v1/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + auth,
      },
      body: JSON.stringify(bookingRequest),
    })

    if (!res.ok) {
      alert('Bokning misslyckades')
      return
    }

    alert('Bokningen lyckades!')
  }

  return (
    <div className="card car-card">
      <h2>{car.name}</h2>
      <p>Typ: {car.type}</p>
      <p>Modell: {car.model}</p>
      <p>Pris per dag: {car.price} kr</p>
      <p>
        Totalt pris: <b>{totalPrice} kr</b> ({totalDays} dagar)
      </p>

      {car.image && (
        <img
          src={`data:image/jpeg;base64,${car.image}`}
          alt={car.name}
          style={{
            width: '250px',
            borderRadius: '10px',
            marginBottom: '10px',
          }}
        />
      )}

      <button onClick={handleBook} className="book-btn">
        Boka
      </button>
    </div>
  )
}
