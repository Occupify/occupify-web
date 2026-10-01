import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout'

const LandingPage = lazy(() => import('@/pages/landing'))
const HomePage = lazy(() => import('@/pages/home'))
const DesignPage = lazy(() => import('@/pages/design'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

export const router = createBrowserRouter([
  // Standalone public entry / authentication landing view
  {
    path: '/',
    Component: LandingPage,
  },
  // Main authenticated application routes with persistent top Navbar
  {
    Component: AppLayout,
    children: [
      {
        path: '/home',
        Component: HomePage,
      },
      {
        path: '/feed',
        Component: HomePage,
      },
    ],
  },
  // Design system showcase
  {
    path: '/design',
    Component: DesignPage,
  },
  // 404 Not Found fallback
  {
    path: '*',
    Component: NotFoundPage,
  },
])
