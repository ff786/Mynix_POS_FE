import { Navigate } from 'react-router-dom'

// TODO: replace with your real auth check (context, redux, etc.)
function isAuthenticated() {
    return Boolean(localStorage.getItem('token'))
}

function ProtectedRoute({ children }) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute