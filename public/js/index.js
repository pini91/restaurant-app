/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */

const hamburger = document.getElementById('hambi')

hamburger.addEventListener('click', displaying)

function displaying () {
  const nav = document.querySelector('.nav')
  // var x = document.getElementById("myLinks");
  if (nav.style.display === 'none') {
    nav.style.display = 'flex'
  } else {
    nav.style.display = 'none'
  }
}
