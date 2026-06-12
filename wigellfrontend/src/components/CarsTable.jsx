import '../styles/TableStyle.css'

export default function CarsTable({
  cars,
  onSort,
  sortConfig,
  onEdit,
  onDelete,
}) {
  function sortArrow(column) {
    if (!sortConfig || sortConfig.key !== column) return ''
    return sortConfig.direction === 'asc' ? '▲' : '▼'
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th onClick={() => onSort('id')}>ID {sortArrow('id')}</th>
          <th onClick={() => onSort('name')}>Namn {sortArrow('name')}</th>
          <th onClick={() => onSort('model')}>Modell {sortArrow('model')}</th>
          <th onClick={() => onSort('type')}>Typ {sortArrow('type')}</th>
          <th onClick={() => onSort('price')}>Pris {sortArrow('price')}</th>
          <th onClick={() => onSort('booked')}>Bokad {sortArrow('booked')}</th>
          <th>Bild</th>
          <th>Alternativ</th>
        </tr>
      </thead>

      <tbody>
        {cars.map((car, i) => (
          <tr key={car.id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
            <td>{car.id}</td>
            <td>{car.name}</td>
            <td>{car.model}</td>
            <td>{car.type}</td>
            <td>{car.price}</td>
            <td>{car.booked ? 'Yes' : 'No'}</td>

            <td>
              {car.image ? (
                <img
                  src={`data:image/jpeg;base64,${car.image}`}
                  alt={car.name}
                  style={{ width: '90px', borderRadius: '8px' }}
                />
              ) : (
                '-'
              )}
            </td>

            <td>
              <button className="edit-btn" onClick={() => onEdit(car)}>
                Redigera
              </button>
              <button className="delete-btn" onClick={() => onDelete(car.id)}>
                Ta bort
              </button>
            </td>
          </tr>
        ))}

        {cars.length === 0 && (
          <tr>
            <td colSpan="8">No cars found</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
