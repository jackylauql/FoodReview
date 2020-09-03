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

var galleryThumbs = new Swiper('.gallery-thumbs', {
    spaceBetween: 10,
    slidesPerView: 4,
    loop: true,
    freeMode: true,
    loopedSlides: 5, //looped slides should be the same
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
  });
var galleryTop = new Swiper('.gallery-top', {
spaceBetween: 10,
loop: true,
loopedSlides: 5, //looped slides should be the same
navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
},
thumbs: {
    swiper: galleryThumbs,
},
});