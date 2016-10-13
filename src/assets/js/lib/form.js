import 'whatwg-fetch';
import serialize from '@f/serialize-form';
import validate from 'validate.js';

export default function signupFactory({ formElem, successClassName }) {
  const form = formElem;

  const inputs = form.querySelectorAll('input');
  const submitButton = form.querySelector('button');
  const validators = {
    name: { presence: true },
    email: {
      presence: true,
      email: true,
    },
    telephone: { presence: true },
    postcode: {
      presence: true,
      length: {
        is: 4,
        message: 'postal code must contain 4 digits',
      },
      numericality: {
        onlyInteger: true,
        message: 'postal code must contain 4 digits',
      },
    },
    numberRooms: { presence: true },
    numberBathrooms: { presence: true },
  };
  let isWaiting = false;

  function init() {
    form.addEventListener('change', handleChange);
    form.addEventListener('submit', handleSubmit);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const error = validate.single(value, validators[name]);

    updateInput(e.target.name, error);
  }

  function updateInput(elemName, error) {
    const errorClassName = 'field--error';
    const elem = [...inputs].reduce((acc, input) => (
      input.getAttribute('name') === elemName ? input : acc
    ), null);

    if (!elem) return;

    const nextSibling = elem.nextSibling;

    if (nextSibling && nextSibling.childNodes.length) {
      elem.parentNode.removeChild(nextSibling);
      elem.parentNode.classList.remove(errorClassName);
    }

    if (error) {
      elem.insertAdjacentHTML(
        'afterend',
        `<span class="field__text">${error[0]}</span>`
      );
      elem.parentNode.classList.add(errorClassName);
    }
  }

  function jsonToQueryString(json) {
    const parts = Object.keys(json).map(prop =>
      `${encodeURIComponent(prop)}=${encodeURIComponent(json[prop])}`
    );

    return parts.join('&');
  }

  function setWaiting() {
    isWaiting = true;
    submitButton.innerText = 'sending...';
  }

  function unsetWaiting() {
    isWaiting = false;
    submitButton.innerText = 'submit';
  }

  function showSuccess() {
    document.body.classList.add(successClassName);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errors = validate(form, validators);

    if (errors) {
      Object.keys(errors).map(key =>
        updateInput(key, errors[key])
      );
    }

    if (!isWaiting && !errors) {
      const json = serialize(e.target);
      const queryString = jsonToQueryString(json);

      setWaiting();

      // Google Apps Scripts seems to only want a query string... ok then.
      fetch(`${window.googleSheetsUrl}?${queryString}`, {
        method: 'POST',
      }).then((response) => {
        if (response.status === 200) {
          unsetWaiting();
          showSuccess();
          form.reset();
        }
      // eslint-disable-next-line no-unused-vars
      }).catch((response) => {
        // console.error(response);
      }).then(unsetWaiting, unsetWaiting);
    }
  }

  function destroy() {
    form.removeEventListener('change', handleChange);
    form.removeEventListener('submit', handleSubmit);
  }

  init();

  return {
    destroy,
  };
}

