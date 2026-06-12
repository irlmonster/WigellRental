import { useState, useEffect } from 'react'
import '../styles/EditCarModal.css'

export default function EditCarModal({ car, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: '',
    model: '',
    feature1: '',
    feature2: '',
    feature3: '',
    type: '',
    price: '',
  })

  const [file, setFile] = useState(null)
  const auth = localStorage.getItem('auth')

  // Förifyller formuläret en gång när car ändras (utan ESLint-varning)
  useEffect(() => {
    if (!car) return

    function fill() {
      setForm({
        name: car.name || '',
        model: car.model || '',
        feature1: car.feature1 || '',
        feature2: car.feature2 || '',
        feature3: car.feature3 || '',
        type: car.type || '',
        price: car.price || '',
      })
    }

    fill()
  }, [car])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // 1️⃣ Uppdatera bilens textfält
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('model', form.model)
    formData.append('feature1', form.feature1)
    formData.append('feature2', form.feature2)
    formData.append('feature3', form.feature3)
    formData.append('type', form.type)
    formData.append('price', form.price)
    formData.append('booked', car.booked)

    const res = await fetch(`/api/v1/cars/${car.id}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Basic ' + auth,
      },
      body: formData,
    })

    if (!res.ok) {
      alert('Kunde inte uppdatera bil (' + res.status + ')')
      return
    }

    // 2️⃣ Ny bild (valfritt)
    if (file) {
      const imgData = new FormData()
      imgData.append('image', file)

      await fetch(`/api/v1/cars/${car.id}/image`, {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + auth,
        },
        body: imgData,
      })
    }

    await onUpdated()
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-fade">
        <div className="edit-car-modal">
          <h2>Redigera Bil – {car.name}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Namn</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Modell</label>
              <input name="model" value={form.model} onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Egenskap 1</label>
              <input
                name="feature1"
                value={form.feature1}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Egenskap 2</label>
              <input
                name="feature2"
                value={form.feature2}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Egenskap 3</label>
              <input
                name="feature3"
                value={form.feature3}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Typ</label>
              <input name="type" value={form.type} onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Pris</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Byt bild (frivilligt)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
              />
            </div>

            <div className="modal-actions">
              <button type="submit" className="save-btn">
                Spara ändringar
              </button>

              <button type="button" onClick={onClose} className="cancel-btn">
                Avbryt
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
