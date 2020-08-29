var newFoodSpotButton = document.getElementById('newFoodSpot')
var newShopButton = document.getElementById('newShop')
var inputForNewShop = document.getElementsByClassName('inputForNewShop')[0]
var inputForNewFood = document.getElementsByClassName('inputForNewFood')[0]

newFoodSpotButton.addEventListener('click', () => {
    inputForNewFood.style.display = 'block'
    newFoodSpotButton.style.padding = '6px 25px'
    newFoodSpotButton.style.backgroundColor = 'rgb(255, 255, 255)'
    newFoodSpotButton.style.zIndex = '1'

    inputForNewShop.style.display = 'none'
    newShopButton.style.padding = '5px 25px'
    newShopButton.style.backgroundColor = 'rgb(240, 240, 240)'
    newShopButton.style.zIndex = '0'
})

newShopButton.addEventListener('click', () => {
    inputForNewShop.style.display = 'block'
    newShopButton.style.padding = '6px 25px'
    newShopButton.style.backgroundColor = 'rgb(255, 255, 255)'
    newShopButton.style.zIndex = '1'

    inputForNewFood.style.display = 'none'
    newFoodSpotButton.style.padding = '5px 25px'
    newFoodSpotButton.style.backgroundColor = 'rgb(240, 240, 240)'
    newFoodSpotButton.style.zIndex = '0'
})