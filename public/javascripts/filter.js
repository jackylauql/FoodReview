var ratingsButton = document.getElementById('ratings')
var ratingsOptions = document.getElementsByClassName('searchRatings')[0]

ratingsButton.addEventListener('click', () => {
    if (ratingsOptions.style.display === 'flex') {
        ratingsOptions.style.display = 'none'
        ratingsButton.style.backgroundColor = 'white'
    } else {
        ratingsOptions.style.display = 'flex'
        ratingsButton.style.backgroundColor = 'rgba(200, 255, 255, 0.800)'
    }
})

ratingsButton.addEventListener('mouseover', () => {
    if (ratingsOptions.style.display != 'flex') {
        ratingsButton.style.cursor = 'pointer'
        ratingsButton.style.backgroundColor = 'rgba(200, 255, 255, 0.800)'
    }
})

ratingsButton.addEventListener('mouseout', () => {
    if (ratingsOptions.style.display != 'flex') {
        ratingsButton.style.backgroundColor = 'white'
    }
})

var locationButton = document.getElementById('location')
var locationOptions = document.getElementsByClassName('searchLocation')[0]

locationButton.addEventListener('click', () => {
    if (locationOptions.style.display === 'flex') {
        locationOptions.style.display = 'none'
        locationButton.style.backgroundColor = 'white'
    } else {
        locationOptions.style.display = 'flex'
        locationButton.style.backgroundColor = 'rgba(200, 255, 255, 0.800)'
    }
})

locationButton.addEventListener('mouseover', () => {
    if (locationOptions.style.display != 'flex') {
        locationButton.style.cursor = 'pointer'
        locationButton.style.backgroundColor = 'rgba(200, 255, 255, 0.800)'
    }
})

locationButton.addEventListener('mouseout', () => {
    if (locationOptions.style.display != 'flex') {
        locationButton.style.backgroundColor = 'white'
    }
})

var typeButton = document.getElementById('type')
var typeOptions = document.getElementsByClassName('searchType')[0]

typeButton.addEventListener('click', () => {
    if (typeOptions.style.display === 'flex') {
        typeOptions.style.display = 'none'
        typeButton.style.backgroundColor = 'white'
    } else {
        typeOptions.style.display = 'flex'
        typeButton.style.backgroundColor = 'rgba(200, 255, 255, 0.800)'
    }
})

typeButton.addEventListener('mouseover', () => {
    if (typeOptions.style.display != 'flex') {
        typeButton.style.cursor = 'pointer'
        typeButton.style.backgroundColor = 'rgba(200, 255, 255, 0.800)'
    }
})

typeButton.addEventListener('mouseout', () => {
    if (typeOptions.style.display != 'flex') {
        typeButton.style.backgroundColor = 'white'
    }
})