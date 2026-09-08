import { Navigate, Route, Routes } from 'react-router'

import { AuthLayout } from './auth/components/AuthLayout.tsx'
import {
  ProtectedRoute,
  PublicOnlyRoute,
} from './auth/components/RouteGuards.tsx'
import { ForgotPasswordPage } from './auth/pages/ForgotPasswordPage.tsx'
import { LoginPage } from './auth/pages/LoginPage.tsx'
import { RegisterPage } from './auth/pages/RegisterPage.tsx'
import { AppShell } from './components/layout/AppShell.tsx'
import { DashboardPage } from './features/todos/pages/DashboardPage.tsx'
import { TodoBoardPage } from './features/todos/pages/TodoBoardPage.tsx'
import { TodoDetailsPage } from './features/todos/pages/TodoDetailsPage.tsx'
import { TodoRegistryPage } from './features/todos/pages/TodoRegistryPage.tsx'

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate replace to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="board" element={<TodoBoardPage />} />
          <Route path="todos" element={<TodoRegistryPage />} />
          <Route path="todos/:todoId" element={<TodoDetailsPage />} />
          <Route path="*" element={<Navigate replace to="/dashboard" />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
