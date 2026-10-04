import { createElement, lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { UserLayout } from '@/components/layout'

const LandingPage = lazy(() => import('@/pages/landing'))
const LoginPage = lazy(() => import('@/pages/login'))
const SignUpPage = lazy(() => import('@/pages/signup'))
const HomePage = lazy(() => import('@/pages/home'))
const DesignPage = lazy(() => import('@/pages/design'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))
const WorkspacePage = lazy(() => import('@/pages/workspace'))
const SavedPage = lazy(() => import('@/pages/saved'))
const NotificationsPage = lazy(() => import('@/pages/notifications'))
const ProfilePage = lazy(() => import('@/pages/profile'))

export const router = createBrowserRouter([
  // Standalone public entry / authentication views
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/signup',
    Component: SignUpPage,
  },
  // Main authenticated application routes with persistent UserLayout & Navigation Bar
  {
    element: createElement(UserLayout),
    children: [
      {
        path: 'home',
        Component: HomePage,
      },
      {
        path: 'feed',
        Component: HomePage,
      },
      {
        path: 'profile',
        Component: ProfilePage,
      },
      {
        path: 'workspace',
        Component: WorkspacePage,
      },
      {
        path: 'projects',
        element: createElement(Navigate, { to: '/workspace', replace: true }),
      },
      {
        path: 'saved',
        Component: SavedPage,
      },
      {
        path: 'notifications',
        Component: NotificationsPage,
      },
      {
        path: 'not-found',
        Component: NotFoundPage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
  // Design system showcase
  {
    path: '/design',
    Component: DesignPage,
  },
])
