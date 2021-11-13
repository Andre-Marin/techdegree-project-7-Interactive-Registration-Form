// Document Selectors //
const nameInput = document.querySelector('#name').focus();
const jobInput = document.querySelector('#title');
const otherJob = document.querySelector('#other-job-role');
  otherJob.style.display = 'none';

const shirtDesign = document.querySelector('#shirt-designs');
const shirtColourSelect = document.querySelector('#shirt-colors');
  shirtColourSelect.style.display = 'none';

const activityCheckboxes = document.querySelectorAll('#activities-box input');
const activities = document.querySelector('#activities');
let activityCost = document.querySelector('#activities-cost');
let total = 0;

//Set Payment form to default with Credit Card selected. Hide other payment method prompts until selected.
const paymentForm = document.querySelector('.payment-methods');
  for (let i = 0; i < paymentForm.children.length; i++) {
    if (paymentForm.children[i].className === 'paypal' ||
        paymentForm.children[i].className === 'bitcoin') {
      paymentForm.children[i].hidden = true;
    }
  }
const paymentType = document.querySelector('#payment');
  paymentType[1].selected = true;

const form = document.querySelector('form');


/*
// EVENT LISTENERS //
*/

jobInput.addEventListener('change', e => {
  const jobSelect = document.querySelectorAll('#title option');
  const job = e.target.value;
  if (job === 'other') {
    otherJob.style.display = 'block';
  } else {
    otherJob.style.display = 'none';
  }
});

// Display shirt colours only when a shirt design is chosen. Dropdown menu only displays colors available for design.
shirtDesign.addEventListener('change', e => {
  const design = e.target.value;
  const shirtDesigns = document.querySelectorAll('#color');
  const shirtOptionElements = document.querySelectorAll('#color option');

  if (design === 'js puns') {
    shirtColourSelect.style.display = 'block';
    shirtOptionElements[1].selected = true;
    shirtOptionElements.forEach(design => {
      if (design.dataset.theme !== 'js puns') {
        design.hidden = true;
      } else {
        design.hidden = false;
      }
    });
  } else if (design === 'heart js') {
    shirtColourSelect.style.display = 'block';
    shirtOptionElements[4].selected = true;
    shirtOptionElements.forEach(design => {
      if (design.dataset.theme !== 'heart js') {
        design.hidden = true;
      } else {
        design.hidden = false;
      }
    });
  }
});

// Tracks activities chosen by user and calculates the total cost of all chosen activities.
activities.addEventListener('change', e => {
  const clicked = e.target.checked;
  let activityPrice = parseInt(e.target.getAttribute('data-cost'));

  if (clicked) {
    total += activityPrice;
    activityCost.textContent = `Total: $${total}`;
  } else if (!clicked) {
    total -= activityPrice;
    activityCost.textContent = `Total: $${total}`;
  }
});

// BLUR AND FOCUS
for (let checkbox of activityCheckboxes) {
  checkbox.addEventListener('focus', e => {
    let label = checkbox.parentNode;
    label.className = 'focus';
  });
  checkbox.addEventListener('blur', e => {
    let label = checkbox.parentNode;
    label.classList.remove('focus');
  });
}

// Displays only the required forms and information for the user's selected payment type
paymentForm.addEventListener('change', e => {
  const input = e.target.value;
  const bitcoinPayment = document.querySelector('#bitcoin');
  const paypalPayment = document.querySelector('#paypal');
  const creditPayment = document.querySelector('#credit-card');

  if (input === 'bitcoin') {
    bitcoinPayment.hidden = false;
    paypalPayment.hidden = true;
    creditPayment.hidden = true;
  } else if (input === 'paypal') {
    bitcoinPayment.hidden = true;
    paypalPayment.hidden = false;
    creditPayment.hidden = true;
  } else {
    bitcoinPayment.hidden = true;
    paypalPayment.hidden = true;
    creditPayment.hidden = false;
  }
});

//Form Validation event listener
form.addEventListener('submit', e => {
  e.preventDefault();
//Helper functions for form Validation
  function notEmpty(elementID) {
    let input = document.querySelector(elementID).value;
    let inputField = document.querySelector(elementID);
    if (input) {
      inputField.parentNode.className = 'valid';
      inputField.parentNode.lastElementChild.style.display = '';
      return true;
    } else {
      inputField.parentNode.className = 'not-valid';
      inputField.parentNode.lastElementChild.style.display = 'block';
      return false;
    }
  }

  function validEmail(email) {
    let isValid = false;
    if (notEmpty(email)) {
      let emailRegEx = /^\w{1,}@\w{1,}[.]com$/i;
      let input = document.querySelector(email).value;
      let inputField = document.querySelector(email);
      let valid = emailRegEx.test(input);
      if (valid) {
        inputField.parentNode.className = 'valid';
        inputField.parentNode.lastElementChild.style.display = '';
        isValid = true;
      } else if (!valid) {
        inputField.parentNode.className = 'not-valid';
        inputField.parentNode.lastElementChild.style.display = 'block';
        isValid = false;
      }
    }
    return isValid;
  }

  function registered() {
    let activities = document.querySelectorAll('#activities input');
    let activityField = document.getElementsByClassName('activities')[0];
    let isValid = false;
    for (let i = 0; i<activities.length; i++) {
      if (activities[i].checked) {
        isValid = true;
      }
    }
    if (!isValid) {
      activityField.className += ' not-valid';
      activityField.classList.remove('valid');
      activityField.lastElementChild.style.display = 'block';
    } else {
      activityField.className += ' valid';
      activityField.classList.remove('not-valid');
      activityField.lastElementChild.style.display = '';
    }
    return isValid;
  }

//STILL NEED TO CREATE ERROR MESSAGES AND ATTATCH CLASS NAMES TO INVALID FIELDS
  function validCreditCard() {
    let cardRegEx = /^\d{13,16}$/;
    let zipCodeRegEx = /^\d{5}$/;
    let cvvRegEx =  /^\d{3}$/;

    let validInput = (regEx, inputId) => {
      let field = document.querySelector(inputId).value;
      let isValid = false;
      if (regEx.test(field)) {
        isValid = true;
      }
      return isValid;
    };

    if (validInput(cardRegEx, '#cc-num') &&
        validInput(zipCodeRegEx, '#zip') &&
        validInput(cvvRegEx, '#cvv')) {
          return true;
        } else {
          return false;
        }
  }

  //Actual form validation
  let nameValid = notEmpty('#name');
  let emailValid = validEmail('#email');
  let userRegistered = registered();
  let validPayment = validCreditCard();

//Run if all input fields are satisfied submit form

  if (nameValid &&
      emailValid &&
      userRegistered &&
      validPayment) {
        //Submit Form
      } else if (!nameValid) {

      } else if (!emailValid) {

      } else if (!userRegistered) {

      }

  // if (paymentType[1].selected) {
  //   if (!validPayment) {
  //     //return false
  //   } else {
  //     //return true
  //   }
  // }

});
