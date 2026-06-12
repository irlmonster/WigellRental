import Navigation from '../components/Navigation'
import Ads from '../components/Ads'
import '../layout.css'
import '../styles/MainLayout.css'

export default function MainLayout({ children }) {
  return (
    <div className="layout-container">
      <header className="layout-header header-fade">
        <img src="/KoncernLogga.png" alt="Wigell logga" />
        <h1>WigellRentals</h1>
      </header>

      <aside className="layout-nav nav-fade">
        <Navigation />
      </aside>

      <main className="layout-content page-anim">{children}</main>

      <aside className="layout-ads ads-fade">
        <Ads />
      </aside>
    </div>
  )
}
