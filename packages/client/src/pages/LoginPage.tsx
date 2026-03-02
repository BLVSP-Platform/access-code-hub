import { AuthDialog } from "@/components/ui/AuthDialog"
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export const LoginPage = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) return <Navigate to="/" replace />;

    return (
        <AuthDialog />
    )
}