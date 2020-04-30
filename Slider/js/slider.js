const prevButton = document.querySelector('.slider-button-prev');
const nextButton = document.querySelector('.slider-button-next');
let activeImageId = 1;

const images = [
    "https://pixabay.com/get/54e0d6424f51a514f6da8c7dda35367b1d37dce65352714d_1280.jpg",
    "https://pixabay.com/get/57e5dd44485aab14f6da8c7dda35367b1d37dce65352754a_1280.jpg",
    "https://pixabay.com/get/53e0d1464a57a514f6da8c7dda35367b1d37dce653547349_1280.jpg",
    "https://pixabay.com/get/57e8dc4a4854a814f6da8c7dda35367b1d37dce653527948_1280.jpg",
    "https://pixabay.com/get/55e0d4474e54ab14f6da8c7dda35367b1d37dce653557549_1280.jpg",
];

window.addEventListener('load', function () {
    UpdateImage()
})

prevButton.addEventListener('click', SetPreviousImage);
nextButton.addEventListener('click', SetNextImage);
document.addEventListener("keyup", function (event) {
    if (event.keyCode === 37) {
        SetPreviousImage();
    }
    if (event.keyCode == 39) {
        SetNextImage();
    }
})

function SetPreviousImage() {
    if (activeImageId > 1) {
        activeImageId--;

        if (activeImageId === 1) {
            prevButton.setAttribute('disabled', 'true');
        }
        if (activeImageId === images.length - 1) {
            nextButton.removeAttribute('disabled')
        }

        UpdateImage();
    }
}

function SetNextImage() {
    if (activeImageId < images.length) {
        activeImageId++;

        if (activeImageId === images.length) {
            nextButton.setAttribute('disabled', 'true');
        }
        if (activeImageId === 2) {
            prevButton.removeAttribute('disabled')
        }
        UpdateImage();
    }
}

function UpdateImage() {
    const image = document.querySelector(".slider-container img");
    const imageNumber = document.querySelector('main p');

    image.setAttribute('src', images[activeImageId - 1]);
    image.setAttribute('alt', `Slide ${activeImageId}`);
    imageNumber.textContent = `${activeImageId}/${images.length}`;
}