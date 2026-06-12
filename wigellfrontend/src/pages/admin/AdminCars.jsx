import { useEffect, useState } from 'react'
import AddCarModal from '../../components/AddCarModal'
import EditCarModal from '../../components/EditCarModal'
import CarsTable from '../../components/CarsTable'

export default function AdminCars() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editCar, setEditCar] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' })

  const auth = localStorage.getItem('auth')

  async function loadCars() {
    try {
      const res = await fetch('/api/v1/cars', {
        headers: { Authorization: 'Basic ' + auth },
      })
      if (!res.ok) return

      const data = await res.json()
      setCars(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true)
        const res = await fetch('/api/v1/cars', {
          headers: { Authorization: 'Basic ' + auth },
        })
        if (!res.ok) {
          console.error('Kunde inte hämta bilar:', res.status)
          return
        }
        const data = await res.json()
        setCars(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [auth])

  function handleSort(column) {
    let direction = 'asc'

    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    setSortConfig({ key: column, direction })
  }

  const sortedCars = [...cars].sort((a, b) => {
    const A = a[sortConfig.key]
    const B = b[sortConfig.key]

    if (A < B) return sortConfig.direction === 'asc' ? -1 : 1
    if (A > B) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  async function handleDelete(id) {
    if (!confirm('Ta bort denna bil?')) return

    const res = await fetch(`/api/v1/cars/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Basic ' + auth },
    })

    if (!res.ok) return alert('Kan inte ta bort bilen.')

    setCars(cars.filter(c => c.id !== id))
  }

  return (
    <div className="page-fade">
      <div style={{ padding: '20px' }}>
        <h1>Admin – Bilar</h1>

        <button className="edit-btn" onClick={() => setIsAdding(true)}>
          Lägg till bil
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <CarsTable
            cars={sortedCars}
            onSort={handleSort}
            sortConfig={sortConfig}
            onEdit={setEditCar}
            onDelete={handleDelete}
          />
        )}

        {editCar && (
          <EditCarModal
            car={editCar}
            onClose={() => setEditCar(null)}
            onUpdated={loadCars}
          />
        )}

        {isAdding && (
          <AddCarModal onClose={() => setIsAdding(false)} onAdded={loadCars} />
        )}
      </div>
    </div>
  )
}
