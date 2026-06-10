const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const closeMenu = document.getElementById('close-menu');

hamburger.addEventListener('click', function() {
  navLinks.classList.toggle('open');
});

closeMenu.addEventListener('click', function() {
  navLinks.classList.remove('open');
});