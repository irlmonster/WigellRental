import '../styles/TableStyle.css'

export default function BookingTable({
  bookings,
  onSort,
  sortConfig,
  onReturn,
  onDelete,
  onEdit,
}) {
  function sortArrow(column) {
    if (sortConfig.key !== column) return ''
    return sortConfig.direction === 'asc' ? '▲' : '▼'
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th onClick={() => onSort('id')}>ID {sortArrow('id')}</th>
          <th onClick={() => onSort('userId')}>
            User ID {sortArrow('userId')}
          </th>
          <th onClick={() => onSort('username')}>
            Användarnamn {sortArrow('username')}
          </th>
          <th onClick={() => onSort('carId')}>Bil {sortArrow('carId')}</th>
          <th onClick={() => onSort('fromDate')}>
            Från {sortArrow('fromDate')}
          </th>
          <th onClick={() => onSort('toDate')}>Till {sortArrow('toDate')}</th>
          <th onClick={() => onSort('active')}>Aktiv {sortArrow('active')}</th>
          <th>Alternativ</th>
        </tr>
      </thead>

      <tbody>
        {bookings.map((b, i) => (
          <tr key={b.id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
            <td>{b.id}</td>
            <td>{b.userId}</td>
            <td>{b.username}</td>
            <td>{b.carId}</td>
            <td>{b.fromDate}</td>
            <td>{b.toDate}</td>
            <td>{b.active ? 'Yes' : 'No'}</td>
            <td>
              <button className="edit-btn" onClick={() => onEdit(b)}>
                Redigera
              </button>
              <button className="return-btn" onClick={() => onReturn(b.id)}>
                Returnera
              </button>
              <button className="delete-btn" onClick={() => onDelete(b.id)}>
                Ta bort
              </button>
            </td>
          </tr>
        ))}

        {bookings.length === 0 && (
          <tr>
            <td colSpan="8">Inga bokningar</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
