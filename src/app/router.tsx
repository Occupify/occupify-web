import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

const HomePage = lazy(() => import('./routes/home'))
const NotFoundPage = lazy(() => import('./routes/not-found'))

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
])
