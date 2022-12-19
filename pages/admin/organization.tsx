import React from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HoC/withAuth'
import { Meta } from '../../components'
import OrganizationComponent from '../../components/organization/Organization'

const Organization = () => {
  const navItems = ['Organization', 'Transactions']

  return (
    <div className="p-3 mt-2 bg-white">
      <Meta title="Organization" />

      <nav className="mb-3">
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          {navItems.map((nav, index) => (
            <button
              key={index}
              className={`nav-link ${nav === 'Organization' ? 'active' : ''}`}
              id={`nav-${nav}-tab`}
              data-bs-toggle="tab"
              data-bs-target={`#nav-${nav}`}
              type="button"
              role="tab"
              aria-controls={`#nav-${nav}`}
              aria-selected="true"
            >
              {nav}
            </button>
          ))}
        </div>
      </nav>

      <div className="tab-content" id="nav-tabContent">
        <div
          className="tab-pane fade show active"
          id="nav-Organization"
          role="tabpanel"
          aria-labelledby="nav-Organization-tab"
          tabIndex={0}
        >
          <OrganizationComponent />
        </div>
        <div
          className="tab-pane fade"
          id="nav-Transactions"
          role="tabpanel"
          aria-labelledby="nav-Transactions-tab"
          tabIndex={0}
        >
          Transactions
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Organization)), {
  ssr: false,
})
