import { useState } from 'react'
import '../styles/AddCarModal.css'

export default function AddCarModal({ onClose, onAdded }) {
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

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('model', form.model)
    formData.append('feature1', form.feature1)
    formData.append('feature2', form.feature2)
    formData.append('feature3', form.feature3)
    formData.append('type', form.type)
    formData.append('price', form.price)
    formData.append('booked', 'false') // ny bil = inte bokad

    if (file) {
      // VIKTIGT: nyckeln måste heta "image" (som i @RequestParam("image"))
      formData.append('image', file)
    }

    const res = await fetch('/api/v1/cars', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + auth, // INGEN Content-Type här
      },
      body: formData,
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      console.error('Add car failed:', res.status, txt)
      alert('Kunde inte skapa bil (' + res.status + ')')
      return
    }

    await onAdded()
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-fade">
        <div className="addcar-modal">
          <h2>Lägg till bil</h2>

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
              <label>Bild (valfritt)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
              />
            </div>

            <div className="modal-actions">
              <button type="submit" className="save-btn">
                Lägg till
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
