import { createElement, lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { UserLayout } from '@/components/layout'

const DesignPage = lazy(() => import('@/pages/design'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))
const WorkspacePage = lazy(() => import('@/pages/workspace'))
const SavedPage = lazy(() => import('@/pages/saved'))
const NotificationsPage = lazy(() => import('@/pages/notifications'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: createElement(UserLayout),
    children: [
      {
        index: true,
        element: createElement(Navigate, { to: '/workspace', replace: true }),
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
  {
    path: '/design',
    Component: DesignPage,
  },
])
