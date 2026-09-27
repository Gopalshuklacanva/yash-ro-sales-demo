'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open menu');
  nav.classList.remove('open');
}
menu.addEventListener('click', () => {
  const opening = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(opening));
  menu.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
  nav.classList.toggle('open', opening);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
const photos = [...document.querySelectorAll('.photo-card')];
const filters = [...document.querySelectorAll('.filter')];
const grid = document.querySelector('.gallery-grid');
filters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filters.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  photos.forEach(photo => { photo.hidden = filter !== 'all' && photo.dataset.category !== filter; });
  grid.classList.toggle('is-filtered', filter !== 'all');
}));
const dialog = document.querySelector('.lightbox');
const lightboxImage = dialog.querySelector('.lightbox-image');
const caption = document.querySelector('#photo-caption');
const counter = dialog.querySelector('.photo-count');
let activePhotos = photos;
let photoIndex = 0;
function showPhoto(index) {
  photoIndex = (index + activePhotos.length) % activePhotos.length;
  const photo = activePhotos[photoIndex];
  lightboxImage.src = photo.getAttribute('href');
  lightboxImage.alt = photo.querySelector('img').alt;
  caption.textContent = photo.dataset.caption;
  counter.textContent = `${photoIndex + 1} / ${activePhotos.length}`;
}
photos.forEach(photo => photo.addEventListener('click', event => {
  if (typeof dialog.showModal !== 'function') return;
  event.preventDefault();
  activePhotos = photos.filter(item => !item.hidden);
  showPhoto(activePhotos.indexOf(photo));
  dialog.showModal();
  document.body.classList.add('modal-open');
}));
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.querySelector('.photo-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
dialog.querySelector('.photo-next').addEventListener('click', () => showPhoto(photoIndex + 1));
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    showPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
