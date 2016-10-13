import 'whatwg-fetch';
import serialize from '@f/serialize-form';
import validate from 'validate.js';

export default function formFactory({ formContainerElem, successElem }) {
  const form = formContainerElem.querySelector('form');

  const controls = form.querySelectorAll('input, textarea, select');
  const submitButton = form.querySelector('button');
  const submitButtonText = submitButton.innerHTML;
  const hiddenClassName = 'is-hidden';

  const validators = {
    name: { presence: true },
    email: {
      presence: true,
      email: true,
    },
    browser: { presence: true },
    browserVersion: { presence: true },
    operatingSystem: { presence: true },
    expectedResult: { presence: true },
    actualResult: { presence: true },
    pageUrl: { presence: true, url: true },
    reproductionSteps: { presence: true },
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
    const errorClassName = 'asd';
    const elem = [...controls].reduce((acc, input) => (
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
        `<p><small class="form-error is-visible">${error[0]}</small></p>`
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
    submitButton.innerHTML = 'sending...';
  }

  function unsetWaiting() {
    isWaiting = false;
    submitButton.innerHTML = submitButtonText;
  }

  function handleSuccess() {
    successElem.classList.remove(hiddenClassName);
    formContainerElem.classList.add(hiddenClassName);
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
      })
        .then((response) => {
          if (response.status === 200) {
            unsetWaiting();
            handleSuccess();
            form.reset();
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch((response) => {
          // console.error(response);
        })
        .then(unsetWaiting, unsetWaiting);
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

