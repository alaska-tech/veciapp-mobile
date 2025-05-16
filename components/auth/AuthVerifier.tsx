import { useRouter } from "expo-router";
import React from "react";

export const Roles = [
  "ADMIN",
  "COMERCIAL",
  "STUDENT",
] as const;
export type RoleType = typeof Roles;

interface AuthCheckerProps {
  requireAuth: boolean // ¿Es necesario que el usuario esté autenticado?
  children: React.ReactNode
  roles?: RoleType[number][] // Roles necesarios para acceder a la página
}

const AuthChecker = ({ children, requireAuth, roles = [] }: AuthCheckerProps): React.ReactNode => {
  const { userSession } = {userSession: {}}
  const { data, isLoading } = {data: {}, isLoading: false}
  const router = useRouter()
  if (isLoading) {
    // Mostrar un mensaje de carga o spinner mientras se verifica la autenticación
    return <p>Loading...</p>
  }
  if (typeof window === 'undefined' || !requireAuth) {
    // SSR: Si estamos en el servidor, simplemente retornamos el componente sin cambios.
    return <>{children}</>
  }

  if (requireAuth && !data) {
    // Si requireAuth es true y el usuario no está autenticado, redirigir al inicio de sesión.
    router.replace('/')
    return null
  }

  if (roles.length > 0 && !!data?.role && !roles.includes(data.role)) {
    router.replace('/+not-found')
    return null
  }

  // Si pasa todas las verificaciones, renderizar el elemento children.
  return <>{children}</>
}

export default AuthChecker
