import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Cars() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  // === HÄMTA BILAR FRÅN BACKEND ===
  useEffect(() => {
    fetch('/api/v1/cars')
      .then(res => {
        if (!res.ok) {
          throw new Error('Kunde inte hämta bilar')
        }
        return res.json()
      })
      .then(data => {
        setCars(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  // === SORTERING ===
  function sortCars(field) {
    const sorted = [...cars].sort((a, b) => (a[field] > b[field] ? 1 : -1))
    setCars(sorted)
  }

  if (loading) return <p>Laddar bilar...</p>

  return (
    <div className="page-fade">
      <div>
        <h1>Bilar</h1>

        {/* SORTERING */}
        <div style={{ marginBottom: '20px' }}>
          <button className="sort-btn" onClick={() => sortCars('name')}>
            Sortera på namn
          </button>
          <button className="sort-btn" onClick={() => sortCars('type')}>
            Sortera på typ
          </button>
        </div>

        {/* LISTA MED BILAR */}
        <div className="car-list">
          {cars.map(car => (
            <div key={car.id} className="car-card">
              <h2>{car.name}</h2>

              <p>Typ: {car.type}</p>
              <p>Modell: {car.model}</p>
              <p>Pris: {car.price} kr/dag</p>

              {/* Features */}
              <ul style={{ marginBottom: '10px' }}>
                <li>{car.feature1}</li>
                <li>{car.feature2}</li>
                <li>{car.feature3}</li>
              </ul>

              {/* Bild */}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
