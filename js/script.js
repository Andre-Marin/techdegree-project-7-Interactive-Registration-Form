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

//Listen for job select 'Other'
// Input box displayed or hidden based off selection
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

// Adjusts displayed inputs based of user payment selection.
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

//Helper functions for form Validation

//Shows or hides error MESSAGES for input fields
//ElementField is the input
//valid is meant to be a boolean value - can be set directly
//isParent adjusts how the DOM is traversed - if element is parent then parentNode is not used.
  function inputHints(elementField, valid, isParent) {
    if (valid) {
      if (isParent === 'true') {
        elementField.className += ' valid';
        elementField.classList.remove('not-valid');
        elementField.lastElementChild.style.display = '';
      } else {
        elementField.parentNode.className = 'valid';
        elementField.classList.remove('not-valid');
        elementField.parentNode.lastElementChild.style.display = '';
      }
    } else if (!valid) {
      if (isParent === 'true') {
        elementField.className += ' not-valid';
        elementField.classList.remove('valid');
        elementField.lastElementChild.style.display = 'block';
      } else {
        elementField.parentNode.className = 'not-valid';
        elementField.classList.remove('valid');
        elementField.parentNode.lastElementChild.style.display = 'block';
      }
    }
  }

//Gets input field values and returns false if blank.
  function notEmpty(elementID) {
    let input = document.querySelector(elementID).value;
    let inputField = document.querySelector(elementID);
    let notEmpty = false;
    if (input) {
      inputHints(inputField, true);
      return true;
    } else {
      inputHints(inputField, false);
      return false;
    }
  }

  function validEmail(email) {
    let emailRegEx = /^\w{1,}@\w{1,}[.]com$/i;
    let input = document.querySelector(email).value;
    let inputField = document.querySelector(email);
    let isValid = emailRegEx.test(input);

    if(notEmpty(email)) {
      inputHints(inputField, isValid);
    }
    return isValid;
  }

//Loop through all available activities and scans for checked activityCheckboxes
//If checked boxes is > 1. The function returns true
  function registered() {
    let activities = document.querySelectorAll('#activities input');
    let activityField = document.getElementsByClassName('activities')[0];
    let isValid = false;
    for (let i = 0; i<activities.length; i++) {
      if (activities[i].checked) {
        isValid = true;
      }
    }
    inputHints(activityField, isValid, 'true');
    return isValid;
  }

  function validCreditCard() {
    let cardRegEx = /^\d{13,16}$/;
    let zipCodeRegEx = /^\d{5}$/;
    let cvvRegEx =  /^\d{3}$/;
    const cc = document.querySelector('#cc-num');
    const zip = document.querySelector('#zip');
    const cvv = document.querySelector('#cvv');
    let validPayment = false;

    let validInput = (regEx, inputId) => {
      let field = document.querySelector(inputId).value;
      let inputField = document.querySelector(inputId);
      let isValid = regEx.test(field);
      if (notEmpty(inputId)) {
        inputHints(inputField, isValid);
      }
      return isValid;
    };

    let ccValid = validInput(cardRegEx, '#cc-num');
    let zipValid = validInput(zipCodeRegEx, '#zip');
    let cvvValid = validInput(cvvRegEx, '#cvv');

    if (ccValid && zipValid && cvvValid) {
      validPayment = true;
    }
    return validPayment;
  }

  //Validating form using all the helper functions preventing submit if one of the required inputs is not satisfied.
  let nameValid = notEmpty('#name');
  let emailValid = validEmail('#email');
  let userRegistered = registered();

  if (!nameValid || !emailValid || !userRegistered) {
    e.preventDefault();
  }

  if (paymentType[1].selected) {
    let validPayment = validCreditCard();
    if (!validPayment) {
      e.preventDefault();
    }
  }

});
