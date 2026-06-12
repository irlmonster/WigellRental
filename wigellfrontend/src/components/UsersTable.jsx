import '../styles/TableStyle.css'

export default function UsersTable({
  users,
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
          <th onClick={() => onSort('username')}>
            Användarnamn {sortArrow('username')}
          </th>
          <th onClick={() => onSort('role')}>Roll {sortArrow('role')}</th>
          <th>Alternativ</th>
        </tr>
      </thead>

      <tbody>
        {users.map((u, i) => (
          <tr key={u.id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
            <td>{u.id}</td>
            <td>{u.username}</td>
            <td>{u.role}</td>
            <td>
              <button className="edit-btn" onClick={() => onEdit(u)}>
                Redigera
              </button>
              <button className="delete-btn" onClick={() => onDelete(u.id)}>
                Ta bort
              </button>
            </td>
          </tr>
        ))}

        {users.length === 0 && (
          <tr>
            <td colSpan="4">No users found</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
