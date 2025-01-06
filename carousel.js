let currentIndex = 0;

function moveSlide(direction) {
  const items = document.querySelectorAll('.carousel-item');
  const totalItems = items.length;

  items[currentIndex].classList.remove('active');
  currentIndex = (currentIndex + direction + totalItems) % totalItems;
  items[currentIndex].classList.add('active');

  const inner = document.querySelector('.carousel-inner');
  inner.style.transform = `translateX(-${currentIndex * 100}%)`;
}
