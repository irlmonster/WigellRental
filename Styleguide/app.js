document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.layout-nav a[data-target]')
  const views = document.querySelectorAll('section[data-view]')

  function showView(view) {
    views.forEach(section => {
      section.style.display = section.dataset.view === view ? 'block' : 'none'
    })
  }

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      showView(link.dataset.target)
    })
  })

  // Default vy
  showView('typografi')
})
