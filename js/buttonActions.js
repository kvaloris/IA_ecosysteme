export function animateChangeYear() {

  const yearDisplay = document.querySelector(".year");
  const backdrop = document.querySelector('.backdrop');
  let year = 1;

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
}

export function closePresentation() {
  const presentation = document.querySelector('.presentation-wp');
  presentation.animate([
    { opacity: 1 }, { opacity: 0 }
  ], {
    duration: 1000
  });
  setTimeout(() => {
    presentation.style.display = "none";
  }, 1000);
}

export function showPresentation() {
  const presentation = document.querySelector('.presentation-wp');
  presentation.style.display = "initial";
  presentation.animate([
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