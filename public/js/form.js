document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded fired')
  const datePicker = document.getElementById('date')
  const hoursSelect = document.getElementById('hoursSelect')

  console.log('datePicker element:', datePicker)
  console.log('hoursSelect element:', hoursSelect)

  if (!datePicker || !hoursSelect) {
    console.error('Required elements not found!')
    return
  }

  // This block sets the default date and trigger the hours update
  if (!datePicker.value) {
    // If the date field is empty, set it to today
    const todayDateStr = new Date().toISOString().slice(0, 10)
    datePicker.value = todayDateStr
    console.log('Set default date to:', todayDateStr)
  }

  // Trigger 'change' on load to populate hours if the field's value is set
  console.log('Triggering change event')
  datePicker.dispatchEvent(new Event('change'))

  // Function to handle date selection (both change and click)
  function handleDateSelection () {
    console.log('Date changed to:', datePicker.value)
    const selectedDateStr = datePicker.value // Keep as string: "2025-09-23"
    const todayStr = new Date().toISOString().slice(0, 10) // Today as string: "2025-09-23"

    console.log('Selected date string:', selectedDateStr)
    console.log('Today string:', todayStr)

    // Clear previous options except the hidden placeholder
    hoursSelect.innerHTML = '<option value="" disabled selected>Hour</option>'
    console.log('Cleared hours select')

    const hours = []

    // Restaurant hours: 12 PM (12) to 11 PM (23)
    const restaurantStart = 12
    const restaurantEnd = 23

    if (selectedDateStr === todayStr) {
      // TODAY: Only show remaining hours (current hour + 1 to 11 PM)
      console.log('Selected date is TODAY')
      const now = new Date()
      const currentHour = now.getHours()
      const startHour = Math.max(restaurantStart, currentHour + 1) // Don't go below 12 PM

      for (let i = startHour; i <= restaurantEnd; i++) {
        const hour12 = i % 12 === 0 ? 12 : i % 12
        const ampm = i < 12 ? 'AM' : 'PM'
        const label = `${String(hour12).padStart(2, '0')}:00 ${ampm}`
        hours.push(label)
      }
    } else {
      // FUTURE DATES: Show all restaurant hours (12 PM to 11 PM)
      console.log('Selected date is FUTURE')
      for (let i = restaurantStart; i <= restaurantEnd; i++) {
        const hour12 = i % 12 === 0 ? 12 : i % 12
        const ampm = i < 12 ? 'AM' : 'PM'
        const label = `${String(hour12).padStart(2, '0')}:00 ${ampm}`
        hours.push(label)
      }
    }

    // Add options to the select
    console.log('Adding hours:', hours)
    hours.forEach(hour => {
      const option = document.createElement('option')
      option.value = hour
      option.textContent = hour
      hoursSelect.appendChild(option)
    })
  }

  // Add both event listeners
  datePicker.addEventListener('change', handleDateSelection)
  datePicker.addEventListener('click', handleDateSelection)
})
