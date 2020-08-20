var ratingsButton = document.getElementById('ratings')
var ratingsOptions = document.getElementsByClassName('searchRatings')[0]

ratingsButton.addEventListener('click', () => {
    if (ratingsOptions.style.display === 'flex') {
        ratingsOptions.style.display = 'none'
    } else {
        ratingsOptions.style.display = 'flex'
    }
    
})