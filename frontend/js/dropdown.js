let toggle   = document.querySelector('#drop-down-menu')
let dropdown = document.querySelector('ul');

toggle.addEventListener('click', () => {
	dropdown.classList.toggle('active');
});