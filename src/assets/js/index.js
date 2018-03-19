import formFactory from './lib/form';

const formContainerElem = document.querySelector('.js-form-container');
const successElem = document.querySelector('.js-success');
const closeSuccessButton = document.querySelector('.js-reveal-form-button');

formFactory({formContainerElem, successElem});

document.addEventListener('click', e => {
  if (e.target === closeSuccessButton) {
    successElem.classList.add('is-hidden');
    formContainerElem.classList.remove('is-hidden');
  }
});
