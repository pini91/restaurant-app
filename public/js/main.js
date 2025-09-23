// Assuming you have an input with id "datePicker" and a div with id "hoursDisplay"
const datePicker = document.getElementById('date')
const hoursDisplay = document.getElementById('hoursDisplay')

datePicker.addEventListener('change', function () {
  const selectedDate = new Date(this.value)
  const today = new Date()

  // Reset time components for accurate date comparison
  selectedDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  if (selectedDate.getTime() === today.getTime()) {
    // If selected date is today, display current hours
    let hoursHtml = '<h3>Available Hours Today:</h3><ul>'
    for (let i = 0; i < 24; i++) {
      hoursHtml += `<li>${String(i).padStart(2, '0')}:00</li>`
    }
    hoursHtml += '</ul>'
    hoursDisplay.innerHTML = hoursHtml
  } else {
    // If not today, clear or display different message
    hoursDisplay.innerHTML = '<option>12:00</option> <br> <option>01:00</option> <br> <option>02:00</option> <br> <option>03:00</option> <br> <option>04:00</option> <br> <option>05:00</option> <br> <option>06:00</option> <br> <option>07:00</option> <br>'
  }
})

// Get all elements with the class "seat"
const elements = document.getElementsByClassName('seat')

Array.from(elements).forEach((el) => {
  el.addEventListener('click', tableNumber)
})

async function tableNumber () {
  // Check if the table is busy (has the 'busy' class)
  if (this.classList.contains('busy')) {
    alert('This table is already reserved for your selected date and time. Please choose another table.')
    return // Exit the function early
  }

  const tableNum = this.innerText
  console.log(tableNum)

  try {
    const response = await fetch('bookForm/assignTable', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        tableNumFromJSFile: tableNum
      })
    })

    const data = await response.json()
    console.log(data)

    if (data === 'tooSmall') {
      alert('Please pick a table with seats for your group size')
    } else if (data === 'failed') {
      alert('Table is busy, please pick another hour or table')
      // location.reload()
    } else {
      window.location.href = '/final'
    }
  } catch (err) {
    console.log(err)
  }
}
