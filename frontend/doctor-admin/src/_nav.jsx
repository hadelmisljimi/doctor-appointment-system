/**
 * Sidebar Navigation Configuration
 *
 * Defines the structure and content of the sidebar navigation menu.
 * Supports multiple navigation component types from CoreUI React:
 * - CNavItem: Single navigation link
 * - CNavGroup: Collapsible group of links
 * - CNavTitle: Section title/divider
 *
 * @module _nav
 */

import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilUser,
  cilCalendar,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

/**
 * Navigation menu structure array
 *
 * @type {Array<Object>}
 * @property {React.ComponentType} component - CoreUI nav component (CNavItem, CNavGroup, CNavTitle)
 * @property {string} name - Display text for the nav item
 * @property {string} [to] - Internal route path (for CNavItem with routing)
 * @property {string} [href] - External URL (for CNavItem with external links)
 * @property {React.ReactNode} [icon] - Icon element to display
 * @property {Object} [badge] - Optional badge configuration
 * @property {string} badge.color - Badge color (info, danger, success, etc.)
 * @property {string} badge.text - Badge text content
 * @property {Array<Object>} [items] - Child items for CNavGroup
 *
 * @example
 * // Simple navigation item
 * {
 *   component: CNavItem,
 *   name: 'Dashboard',
 *   to: '/dashboard',
 *   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
 * }
 *
 * @example
 * // Navigation group with children
 * {
 *   component: CNavGroup,
 *   name: 'Base',
 *   to: '/base',
 *   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
 *   items: [
 *     {
 *       component: CNavItem,
 *       name: 'Cards',
 *       to: '/base/cards',
 *     },
 *   ],
 * }
 *
 * @example
 * // Section title
 * {
 *   component: CNavTitle,
 *   name: 'Theme',
 * }
 */
const _nav = [
  

  {
  component: CNavGroup,
  name: 'Doctors',
  icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'All Doctors',
      to: '/doctors',
    },
    {
      component: CNavTitle,
      name: 'Admin Only',
    },
    {
      component: CNavItem,
      name: 'Add Doctor',
      to: '/doctors/add',
    },
    {
      component: CNavItem,
      name: 'Edit Doctor',
      to: '/doctors/edit'
    },
    {
      component: CNavItem,
      name: 'Delete Doctor',
      to: '/doctors/delete'
    },
  ],
},

  {
  component: CNavGroup,
  name: 'Patients',
  icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'All Patients',
      to: '/patients',
    },
    
    {
      component: CNavItem,
      name: 'Add Patient',
      to: '/patients/add',
    },
    {
      component: CNavTitle,
      name: 'Doctor & Admin Only',
    },
    {
      component: CNavItem,
      name: 'Edit Patient',
      to: '/patients/edit',
    },
    {
      component: CNavItem,
      name: 'Delete Patient',
      to: '/patients/delete',
    },
  ],
},

  {
  component: CNavGroup,
  name: 'Appointments',
  icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'All Appointments',
      to: '/appointments',
    },
    
    {
      component: CNavItem,
      name: 'Book Appointment',
      to: '/appointments/book',
    },
    {
      component: CNavTitle,
      name: 'Doctor & Admin Only',
    },
  
    {
      component: CNavItem,
      name: 'Delete Appointment',
      to: '/appointments/delete',
    },
    {
      component: CNavItem,
      name: 'Mark As Completed',
      to: '/appointments/completed',
    },
    {
      component: CNavItem,
      name: 'Mark As Cancelled',
      to: '/appointments/cancelled',
    },
  ],
},

  {
    component: CNavItem,
    name: 'Help',
    to: '/help',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
]

export default _nav
