import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useColorModes } from '@coreui/react'

import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from '../components/index'

const DefaultLayout = () => {

  const { colorMode } =
    useColorModes('coreui-free-react-admin-template-theme')

  const location = useLocation()

  useEffect(() => {
    if (colorMode === 'dark') {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
  }, [colorMode])

  
  

  // ===============================
  // ROUTES WHERE SIDEBAR IS SHOWN
  // ===============================
  const dashboardRoutes = [
    "/doctors",
    "/patients",
    "/appointments",
    "/doctors/delete",
    "/patients/delete",
    "/doctors/edit",
    "/patients/edit",
    "/doctors/add",
    "/patients/add",
  ]

  const showSidebar = dashboardRoutes.some(route =>
    location.pathname.startsWith(route)
  )

  return (
    <div>

      {/* SIDEBAR ONLY FOR DASHBOARD */}
      {showSidebar && <AppSidebar />}

      <div className="wrapper d-flex flex-column min-vh-100">

        <AppHeader />

        <div className="body flex-grow-1">
          <AppContent />
        </div>

        <AppFooter />

      </div>
    </div>
  )
}

export default DefaultLayout;