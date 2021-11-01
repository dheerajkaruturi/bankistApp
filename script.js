'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabscontainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//smooth scrolling: (learnt)
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

/* 
page navigation without event delegation:
document.querySelectorAll('.nav__link').forEach(function(el){
  el.addEventListener('click', function(e){
  e.preventDefault();
  const id = this.getAttribute('href');
  console.log(id);
  document.querySelector(id).scrollIntoView({behavior : "smooth"});
  });
});
now the above function will be good for some limited number of elements. so we use event delagations to prevent the lags that may happen.
---------------------------------------------------------------
page navigation: using event delegation.
STEPS TO FOLLOW WHILE DOING EVENT DELEGATION:
1. add event listener to the common parent element.
2. determine what element originated the event.*/
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matching strategy:
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// tabbed contents:
tabscontainer.addEventListener('click', function (e) {
  //step 1 : selecting tab
  const clicked = e.target.closest('.operations__tab'); // went up to parent using traversing
  console.log(clicked);

  //if (!clicked) return; //gaurd clause

  //step 2 adding active class to tab
  if (clicked) {
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');
    //step 3 changing content with respect to active tab
    tabsContent.forEach(t => t.classList.remove('operations__content--active'));
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  }
});

/*
***************same code we have above********************
// event delegation concept: we select the parent element for this.
tabscontainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  //gaurd clause:
  if (!clicked) return;
  /* ***EXPLAIN: when the click happens in betweer the buttons it shows the value as null and throws an error. So to avoid that error (Note: null value is least concerned so we can leave that) we wrote this gaurd clause. The condition is, when the click happens on the place were the value is not equal to clicked variable the function will returned and the code after that will not be executed anymore.*** x

  // adding and removing active class for tabs:
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // adding and removing active class to the tab contents:
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
***************same code we have above********************
NOTE: above code we used closest method because there are child elements inside, so to prevent the clicking on them we used closest class of those child elements.
*/

// menu fade animation: again we use the event delegation.
const hoverFade = function () {
  nav.addEventListener('mouseover', function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = document.querySelectorAll('.nav__link'); // here i directly selected the all the nav__link elements
      const logo = document.querySelector('img');

      //change opacity when mouseover:
      siblings.forEach(function (el) {
        if (el !== link) {
          el.style.opacity = 0.5;
        }
      });
      logo.style.opacity = 0.5;
    }
  });
  nav.addEventListener('mouseout', function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link'); // here i first went up i.e., to main parent element nav using closest(), then from there selected the nav__link elements
      const logo = link.closest('.nav').querySelector('img'); //same as the above way of selecting.

      //change opacity when mouseover:
      siblings.forEach(function (el) {
        if (el !== link) {
          el.style.opacity = 1;
        }
      });
      logo.style.opacity = 1;
    }
  });
};
hoverFade();
/*
**************making the above nav elements fade functionality code shorter**************
 // Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
 */

// sticky navigation on scroll to section1:
/*
// getting to check the position co-ordinates of section1
const topPos = section1.getBoundingClientRect();
console.log(topPos); // logs the co-ordinates.
window.addEventListener('scroll', function (e) {
  // console.log(e);
  // console.log(window.scrollY);
  if (window.scrollY > topPos.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
*/
// scroll functionality using the intersection observer API:
/* explanation demo:
const obsCallback = function (entries, observer) {
  entries.forEach(entry => console.log(entry));
};
const obsOptions = {
  root: null,
  threshold: 0.2,
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);*/

/*
 ************** INTERSECTION OBSERVER API **************
 */
// step :1 selecting the elements
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

// step :3 callback function
const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
// step :2 creating intersection observer with callback function and object
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
  // this root margin is not hard coded because when we design a responsive page the resolution changes.
});
headerObserver.observe(header);

// reveal sections:

const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden'); //whenever a new target comes i.e., when we scroll to a new section the observer observes that and removes the hidden class.
    observer.unobserve(entry.target); // stops the events to log once the whole page is loades.
  }
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});

// lazy loading of images:
const allImg = document.querySelectorAll('img[data-src]');

//configuring the callback function:
const lazyFunction = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (entry.isIntersecting) {
    console.log(entry.target);
    entry.target.src = entry.target.dataset.src;
    // NOTE: directly removing the class 'lazy-img' may effect some devices.at slow internet images wont load so we use event listerner.

    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  }
};
// applying intersection observer api:
const imgObserver = new IntersectionObserver(lazyFunction, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
allImg.forEach(img => imgObserver.observe(img));

// slider:
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let currentSlide = 0;
  const maxSlide = slides.length;

  // arranging the items side by side using translate property : 0%, 100%, 200%, 300%
  slides.forEach(
    (slide, index) => (slide.style.transform = `translateX(${100 * index}%)`)
  );
  console.log(slides);

  // function from going to previous slide:
  const move_to_previousSlide = function () {
    currentSlide === 0 ? (currentSlide = maxSlide - 1) : currentSlide--;
    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`)
      // currentslide is 1: -100%, 0%, 100%, 200%
    );
  };
  // function from going to next slide:
  const move_to_nextSlide = function () {
    currentSlide === maxSlide - 1 ? (currentSlide = 0) : currentSlide++;
    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`)
      // currentslide is 1: -100%, 0%, 100%, 200%
    );
  };

  // move to next slide:
  btnRight.addEventListener('click', move_to_nextSlide);
  // move to previous slide:
  btnLeft.addEventListener('click', move_to_previousSlide);

  // adding keydown event:
  //objective : left arrow -> previous slide, right arrow -> next slide
  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') {
      move_to_previousSlide();
    }
    if (e.key === 'ArrowRight') {
      move_to_nextSlide();
    }
  });
};
slider();

//creating, inserting and deleting the cookie message:(learnt)

const message = document.createElement('div');
message.classList.add('cookie-message');
message.style.height = '80px';
message.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
message.style.color = 'white';
message.style.borderRadius = '50px';
message.innerHTML =
  'We used cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
//header.prepend(message);// creates a message on the top of the header but inside of tag.
header.append(message); // creates a message at the end of the header but inside of tag.
//header.after(message);// creates a message after the header tag.
//header.before(message);// creates a message before the heaader tag.

// deleting or removing the element.
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); // deletes the message.
  });

/*
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    curSlide === maxSlide - 1 ? (curSlide = 0) : curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    curSlide === 0 ? (curSlide = maxSlide - 1) : curSlide--; 
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
*/
////////////////////////// Lectures ///////////////////////////////////////////
/*const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections); // generates a nodelist of all section
document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons); // generate a collectionHTMl of all buttons used in the document.
console.log(document.getElementsByClassName('btn'));*/
