var newFoodSpotButton = document.getElementById('newFoodSpot')
var newShopButton = document.getElementById('newShop')
var inputForNewShop = document.getElementsByClassName('inputForNewShop')[0]
var inputForNewFood = document.getElementsByClassName('inputForNewFood')[0]
var shopItemRow = document.getElementsByClassName('shopItemRow')
var shopName = document.getElementById('shopName')
var rightSide = document.getElementsByClassName('displayShopItems')[0]
var newFoodButton = document.getElementById('newFoodSpot')
var newShop = document.getElementById('newShop')

newFoodButton.addEventListener('mouseover', () => {
    if (inputForNewFood.style.display != 'block') {
        newFoodButton.style.cursor = 'pointer'
        newFoodButton.style.backgroundColor = 'white'
    }    
})

newShop.addEventListener('mouseover', () => {
    if (inputForNewShop.style.display != 'block') {
        newShop.style.cursor = 'pointer'
        newShop.style.backgroundColor = 'white'
    }
})

newFoodButton.addEventListener('mouseout', () => {
    if (inputForNewFood.style.display != 'block') {
        newFoodButton.style.cursor = 'auto'
        newFoodButton.style.backgroundColor = 'rgb(240, 240, 240)'
    }
})

newShop.addEventListener('mouseout', () => {
    if (inputForNewShop.style.display != 'block') {
        newShop.style.cursor = 'auto'
        newShop.style.backgroundColor = 'rgb(240, 240, 240)'
    }
})

var currentShop = shopName.options[shopName.selectedIndex].innerHTML
var currentShopClass = document.getElementsByClassName(currentShop)
var currentIndex = 0
var prevShopClass = currentShopClass
while (currentIndex < currentShopClass.length) {
    currentShopClass[currentIndex].style.display = 'block'
    currentShopClass[currentIndex].style.animationName = 'slideFromLeft'
    currentShopClass[currentIndex].style.right = '0px'
    currentIndex = currentIndex + 1
}

const displayNone = () => {
    var index = 0
    while (index < prevShopClass.length) {
        prevShopClass[index].style.display = 'none'
        index = index + 1
    }
}

const displayBlock = () => {
    var index = 0
    while (index < currentShopClass.length) {
        currentShopClass[index].style.display = 'block'
        index = index + 1
    }
}


shopName.addEventListener('change', () => {
    prevShopClass = currentShopClass
    prevIndex = 0

    while (prevIndex < prevShopClass.length) {
        prevShopClass[prevIndex].style.animationName = 'bottomDownDisappear'
        setTimeout(displayNone, 1000)
        prevIndex = prevIndex + 1
    }


    currentShop = shopName.options[shopName.selectedIndex].innerHTML
    currentShopClass = document.getElementsByClassName(currentShop)
    currentIndex = 0

    while (currentIndex < currentShopClass.length) {
        currentShopClass[currentIndex].style.animationName = 'slideFromLeft'
        currentShopClass[currentIndex].style.right = '0px'
        setTimeout(displayBlock, 1000)
        currentIndex = currentIndex + 1
    }
})



newFoodSpotButton.addEventListener('click', () => {
    inputForNewFood.style.display = 'block'
    newFoodSpotButton.style.padding = '7px 25px'
    newFoodSpotButton.style.backgroundColor = 'rgb(255, 255, 255)'
    newFoodSpotButton.style.zIndex = '3'

    rightSide.style.animationName = 'slideFromLeft'
    rightSide.style.right = '0px'

    inputForNewShop.style.display = 'none'
    newShopButton.style.padding = '6px 25px'
    newShopButton.style.backgroundColor = 'rgb(240, 240, 240)'
    newShopButton.style.zIndex = '0'
})

newShopButton.addEventListener('click', () => {
    inputForNewShop.style.display = 'block'
    newShopButton.style.padding = '7px 25px'
    newShopButton.style.backgroundColor = 'rgb(255, 255, 255)'
    newShopButton.style.zIndex = '3'

    rightSide.style.animationName = 'slideFromRight'
    rightSide.style.right = '500px'

    inputForNewFood.style.display = 'none'
    newFoodSpotButton.style.padding = '6px 25px'
    newFoodSpotButton.style.backgroundColor = 'rgb(240, 240, 240)'
    newFoodSpotButton.style.zIndex = '0'
})

var rowIndex = 0
while (rowIndex < shopItemRow.length) {
    const item = shopItemRow[rowIndex].nextElementSibling
    shopItemRow[rowIndex].addEventListener('click', () => {
        if (item.style.height == '105px') {
            item.style.animationName = 'newBottomUp'
            item.style.height = '0px'
        } else {
            item.style.animationName = 'newTopDown'
            item.style.height = '105px'
        }
        
    })
    rowIndex = rowIndex + 1
}