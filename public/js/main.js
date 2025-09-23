const datePicker = document.getElementById('date')
const hoursSelect = document.getElementById('hoursSelect')

datePicker.addEventListener('change', function () {
  const selectedDate = new Date(this.value)
  const today = new Date()
  selectedDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  // Clear previous options except the hidden placeholder
  hoursSelect.innerHTML = '<option hidden required>Hour</option>'

  const hours = []
  if (selectedDate.getTime() === today.getTime()) {
    // Only show hours left today (example: from current hour + 1 to 23)
    const now = new Date()
    const startHour = now.getHours() + 1
    for (let i = startHour; i <= 23; i++) {
      const hour12 = i % 12 === 0 ? 12 : i % 12
      const ampm = i < 12 ? 'AM' : 'PM'
      const label = `${String(hour12).padStart(2, '0')}:00 ${ampm}`
      hours.push(label)
    }
  } else {
    // Show all hours for other days (12:00 PM to 11:00 PM)
    for (let i = 12; i <= 23; i++) {
      const hour12 = i % 12 === 0 ? 12 : i % 12
      const ampm = i < 12 ? 'AM' : 'PM'
      const label = `${String(hour12).padStart(2, '0')}:00 ${ampm}`
      hours.push(label)
    }
  }

  // Add options to the select
  hours.forEach(hour => {
    const option = document.createElement('option')
    option.value = hour
    option.textContent = hour
    hoursSelect.appendChild(option)
  })
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
