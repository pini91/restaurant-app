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
