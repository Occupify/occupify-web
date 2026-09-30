import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

const DesignPage = lazy(() => import('@/pages/design'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

export const router = createBrowserRouter([
  {
    path: '/design',
    Component: DesignPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
])
