import { useEffect, useState } from 'react'
import AddUserModal from '../../components/AddUserModal'
import EditUserModal from '../../components/EditUserModal'
import UsersTable from '../../components/UsersTable'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' })
  const [isAdding, setIsAdding] = useState(false)
  const [editUser, setEditUser] = useState(null)

  const auth = localStorage.getItem('auth')

  async function loadUsers() {
    const res = await fetch('/api/v1/users', {
      headers: { Authorization: 'Basic ' + auth },
    })
    if (res.ok) setUsers(await res.json())
  }

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/v1/users', {
        headers: { Authorization: 'Basic ' + auth },
      })

      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    }

    fetchUsers()
  }, [auth])

  function handleSort(column) {
    let direction = 'asc'
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key: column, direction })
  }

  async function handleDelete(id) {
    if (!confirm('Delete user?')) return

    const res = await fetch(`/api/v1/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Basic ' + auth },
    })

    if (!res.ok) return alert('Could not delete user')

    setUsers(users.filter(u => u.id !== id))
  }

  const sortedUsers = [...users].sort((a, b) => {
    const A = a[sortConfig.key]
    const B = b[sortConfig.key]
    if (A < B) return sortConfig.direction === 'asc' ? -1 : 1
    if (A > B) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  return (
    <div className="page-fade">
      <div style={{ padding: '20px' }}>
        <h1>Admin – Users</h1>

        <button className="edit-btn" onClick={() => setIsAdding(true)}>
          Skapa Användare
        </button>

        <UsersTable
          users={sortedUsers}
          onEdit={setEditUser}
          onDelete={handleDelete}
          onSort={handleSort}
          sortConfig={sortConfig}
        />

        {editUser && (
          <EditUserModal
            user={editUser}
            onClose={() => setEditUser(null)}
            onUpdated={loadUsers}
            isAdmin={true}
          />
        )}

        {isAdding && (
          <AddUserModal
            onClose={() => setIsAdding(false)}
            onAdded={loadUsers}
          />
        )}
      </div>
    </div>
  )
}
