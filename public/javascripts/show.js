var deleteButton = document.getElementsByClassName('delete')[0]
var deleteText = document.getElementsByClassName('deleteConfirmationText')[0]
var deleteBox = document.getElementsByClassName('deleteConfirmationBox')[0]
var deleteNo = document.getElementsByClassName('deleteNo')[0]

deleteButton.addEventListener('click', () => {
    deleteText.style.display = 'block'
    deleteBox.style.display = 'flex'
})

deleteNo.addEventListener('click', () => {
    deleteText.style.display = 'none'
    deleteBox.style.display = 'none'
})