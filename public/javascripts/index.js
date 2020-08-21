var ratingsButton = document.getElementById('ratings')
var ratingsOptions = document.getElementsByClassName('searchRatings')[0]

ratingsButton.addEventListener('click', () => {
    if (ratingsOptions.style.display === 'flex') {
        ratingsOptions.style.display = 'none'
    } else {
        ratingsOptions.style.display = 'flex'
    }
})

var locationButton = document.getElementById('location')
var locationOptions = document.getElementsByClassName('searchLocation')[0]

locationButton.addEventListener('click', () => {
    if (locationOptions.style.display === 'block') {
        locationOptions.style.display = 'none'
    } else {
        locationOptions.style.display = 'block'
    }
})