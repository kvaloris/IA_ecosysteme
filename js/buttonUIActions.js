export function animateChangeYear(year) {

  const yearDisplay = document.querySelector(".year");
  const backdrop = document.querySelector('.backdrop');

  // Increment the year

  year = year + 1;
  yearDisplay.innerHTML = "Year " + year;

  const duration1 = 1000;
  const duration2 = 600;

  // Animation part 1

  yearDisplay.classList.add("yearChange");
  backdrop.style.display = "initial";
  backdrop.animate([
    { opacity: 0 }, { opacity: 1 }
  ], {
    duration: duration1,
  });
  yearDisplay.animate([
    { opacity: 0 }, { opacity: 1 }
  ], {
    duration: duration2,
    delay: duration1 - duration2
  });

  // Animation part 2

  backdrop.animate([
    { opacity: 1 }, { opacity: 0 }
  ], {
    delay: duration1,
    duration: duration1,
  });
  setTimeout(() => {
    yearDisplay.setAttribute("style", "transition: 1s");
    yearDisplay.classList.remove("yearChange");
  }, duration1);

  // When the animation ends

  setTimeout(() => {
    backdrop.style.display = "none";
    yearDisplay.setAttribute("style", "");
  }, duration1 * 2);

  return year;
}

export function closePopup(node) {
  node.animate([
    { opacity: 1 }, { opacity: 0 }
  ], {
    duration: 1000
  });
  setTimeout(() => {
    node.style.display = "none";
  }, 1000);
}

export function showPopup(node) {
  node.style.display = "initial";
  node.animate([
    { opacity: 0 }, { opacity: 1 }
  ], {
    duration: 1000
  });
}

export function handleSlidersConsoleDisplay() {
  const slidersBtnImg = document.querySelector('#sliders-btn > img');
  const slidersConsole = document.querySelector('.sliders-console');
  slidersConsole.classList.toggle('goDown');
  const btnImgPath = slidersConsole.className.includes('goDown') ? "/assets/slider.png" : "/assets/arrow.png";
  slidersBtnImg.setAttribute('src', btnImgPath);
  slidersBtnImg.setAttribute('style', 'transform: rotate(180deg)');
}

export function fillFishingOptions() {

  function fillOption(inputNode, minValue, maxValue) {
    for(let i=minValue; i<=maxValue; i++) {
      inputNode.setAttribute('min', minValue);
      inputNode.setAttribute('max', maxValue);
      inputNode.setAttribute('value', minValue);
    }
  }

  const sizeInput = document.querySelector('[name=fishing-opt-size]');
  const eyesInput = document.querySelector('[name=fishing-opt-eyes]');
  const finsInput = document.querySelector('[name=fishing-opt-fins]');
  const tailsInput = document.querySelector('[name=fishing-opt-tails]');

  fillOption(sizeInput, MINSIZE, MAXSIZE);
  fillOption(eyesInput, 0, MAXeye);
  fillOption(finsInput, 0, MAXfin);
  fillOption(tailsInput, 0, MAXtail);
}

export function updateFishingResult(number) {
  const placeholder = document.querySelector('#fishing-result-ph');

  if(number === 0) placeholder.innerHTML = "You have caught no fish.";
  else if(number === 1) placeholder.innerHTML = "You have caught " + number + " fish.";
  else placeholder.innerHTML = "You have caught " + number + " fishes.";
}

export function updateFishingErrorMessage(number) {
  const placeholder = document.querySelector('#fishing-error');
  if(number === 0) {
    placeholder.innerHTML = "There is no fish with those caracteristics";
    return false;
  }
  else {
    placeholder.innerHTML = "";
    return true;
  }
}