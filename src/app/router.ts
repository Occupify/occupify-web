import { createElement, lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { UserLayout } from '@/components/layout'
import { RouteErrorBoundary } from '@/components/feedback'

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
const MyWalletPage = lazy(() => import('@/pages/wallet'))
const FinancialHistoryPage = lazy(() => import('@/pages/financial-history'))
const OccupifyAiPage = lazy(() => import('@/pages/occupify-ai'))
const JobRecommendationPage = lazy(() => import('@/pages/occupify-ai/JobRecommendationPage'))
const AiFeaturePlaceholderPage = lazy(() => import('@/pages/occupify-ai/AiFeaturePlaceholderPage'))
const JobDetailPage = lazy(() => import('@/pages/jobs'))

export const router = createBrowserRouter([
  // Standalone public entry / authentication views
  {
    path: '/',
    Component: LandingPage,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: '/login',
    Component: LoginPage,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: '/signup',
    Component: SignUpPage,
    ErrorBoundary: RouteErrorBoundary,
  },
  // Main authenticated application routes with persistent UserLayout & Navigation Bar
  {
    element: createElement(UserLayout),
    ErrorBoundary: RouteErrorBoundary,
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
        path: 'wallet',
        Component: MyWalletPage,
      },
      {
        path: 'financial-history',
        Component: FinancialHistoryPage,
      },
      {
        path: 'workspace',
        Component: WorkspacePage,
      },
      {
        path: 'occupify-ai',
        Component: OccupifyAiPage,
      },
      {
        path: 'occupify-ai/job-recommendation',
        Component: JobRecommendationPage,
      },
      {
        path: 'occupify-ai/:featureId',
        Component: AiFeaturePlaceholderPage,
      },
      {
        path: 'ai',
        element: createElement(Navigate, { to: '/occupify-ai', replace: true }),
      },
      {
        path: 'projects',
        element: createElement(Navigate, { to: '/workspace', replace: true }),
      },
      {
        path: 'jobs/:jobId',
        Component: JobDetailPage,
      },
      {
        path: 'contracts/:jobId',
        Component: JobDetailPage,
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
    ErrorBoundary: RouteErrorBoundary,
  },
])
