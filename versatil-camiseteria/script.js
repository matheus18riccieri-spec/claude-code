document.documentElement.classList.replace('no-js', 'js')

document.getElementById('year').textContent = new Date().getFullYear()

const menuToggle = document.getElementById('menuToggle')
const mainNav = document.getElementById('mainNav')

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open')
  menuToggle.setAttribute('aria-expanded', String(isOpen))
})

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open')
    menuToggle.setAttribute('aria-expanded', 'false')
  })
})

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
  )

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
} else {
  document
    .querySelectorAll('.reveal')
    .forEach(el => el.classList.add('in-view'))
}
