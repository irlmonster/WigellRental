import { useState } from 'react'
import '../styles/EditBookingModal.css' // vi uppdaterar även denna CSS efteråt

export default function EditBookingModal({ booking, onClose, onSave }) {
  const [form, setForm] = useState({
    fromDate: booking.fromDate,
    toDate: booking.toDate,
    userId: booking.userId,
    carId: booking.carId,
    active: booking.active,
  })

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleSubmit() {
    onSave({
      ...booking,
      ...form,
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-fade">
        <div className="edit-car-modal">
          <h2>Ändra bokning #{booking.id}</h2>

          {/* FROM DATE */}
          <div className="form-row">
            <label>Från datum:</label>
            <input
              type="date"
              name="fromDate"
              value={form.fromDate}
              onChange={handleChange}
            />
          </div>

          {/* TO DATE */}
          <div className="form-row">
            <label>Till datum:</label>
            <input
              type="date"
              name="toDate"
              value={form.toDate}
              onChange={handleChange}
            />
          </div>

          {/* USER ID */}
          <div className="form-row">
            <label>User ID:</label>
            <input
              type="number"
              name="userId"
              value={form.userId}
              onChange={handleChange}
            />
          </div>

          {/* CAR ID */}
          <div className="form-row">
            <label>Bil ID:</label>
            <input
              type="number"
              name="carId"
              value={form.carId}
              onChange={handleChange}
            />
          </div>

          {/* ACTIVE CHECKBOX */}
          <div className="checkbox-row">
            <label htmlFor="active">Aktiv</label>
            <input
              id="active"
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
          </div>

          {/* BUTTONS */}
          <div className="modal-actions">
            <button className="save-btn" onClick={handleSubmit}>
              Spara
            </button>
            <button className="cancel-btn" onClick={onClose}>
              Avbryt
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
