// Get all elements with the class "seat"
const elements = document.getElementsByClassName('seat')

Array.from(elements).forEach((el) => {
  el.addEventListener('click', tableNumber)
})

async function tableNumber () {
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

    if (data === 'failed') {
      alert('Table is busy, please pick another hour or table')
      // location.reload()
    } else {
      window.location.href = 'http://localhost:2121/final'
    }
  } catch (err) {
    console.log(err)
  }
}
