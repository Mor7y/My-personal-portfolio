const navToggleIcon = document.querySelector(".nav-toggle");
const header = document.querySelector(".header");
const navSections = document.querySelectorAll(".nav-list a");
const themeMenuToggle = document.querySelector(".theme i");
const themePalete = document.querySelector(".color-palete");
const themeColors = document.querySelectorAll(".color-palete li");
const scrollTop = document.querySelector('.scroll-top')

//----------------Events-----------------------//

navToggleIcon.onclick = (e) => {
  toggleElement(header, e.target);
};

navSections.forEach((section) => {
  section.addEventListener("click", function () {
    if (window.innerWidth < 700) {
      toggleElement(header, navToggleIcon);
    }
  });
});

themeColors.forEach((color) => {
  color.onclick = (e) => {
    const style = window.getComputedStyle(e.target);
    if (style.opacity === "0") return;

    const themeClass = e.target.className;
    document.body.className = `theme-${themeClass}`;

    const items = JSON.parse(localStorage.getItem("theme")) || [];
    items[0] = themeClass;
    localStorage.setItem("theme", JSON.stringify(items));

    manageActiveClass(themeColors, e.target);
  };
});

window.onload = () => {
  const themeClass = JSON.parse(localStorage.getItem("theme"));
  const themeIcon = document.querySelector(`.color-palete .${themeClass}`);
  document.body.className = `theme-${themeClass}`;

  manageActiveClass(themeColors, themeIcon);
};

themeMenuToggle.onclick = () => {
  toggleElement(themePalete, themeMenuToggle);
};

//-------------Functions------------------//

function toggleElement(element, icon) {
  element.classList.toggle("show");
  icon.classList.toggle("fa-xmark");

  const closeElementOnWindowClick = (e) => {
    const offset = element.getBoundingClientRect();
    if (
      e.y < offset.bottom &&
      e.y > offset.top &&
      e.x < offset.right &&
      e.x > offset.left
    ) {
      if (!element.classList.contains("show")) {
        window.removeEventListener("click", closeElementOnWindowClick);
      }
      return;
    } else {
      element.classList.remove("show");
      icon.classList.remove("fa-xmark");
      window.removeEventListener("click", closeElementOnWindowClick);
    }
  };

  if (element.classList.contains("show")) {
    setTimeout(() => {
      window.addEventListener("click", closeElementOnWindowClick);
    }, 100);
  } else {
    window.removeEventListener("click", closeElementOnWindowClick);
  }
}

function manageActiveClass(elGroup, target) {
  elGroup.forEach((el) => {
    el.classList.remove("active");
  });
  target.classList.add("active");
}

function textAnimation(el) {
  const text = el.dataset.value;
  const textArr = text.split("");
  let iterations = 0;
  const interval = setInterval(() => {
    const effect = textArr.map((char, index) => {
      if (index < iterations) {
        return char;
      }
      const barChar = String.fromCharCode(124);
      const spaceChar = String.fromCharCode(32);

      if (index === iterations) {
        return barChar;
      }

      return spaceChar;
    });

    if (el.classList.contains("home-greeting")) {
      const firstPart = effect.slice(0, 8).join("");
      const secondPart = effect.slice(8, 13).join("");

      el.innerHTML = `${firstPart}<span>${secondPart}</span>!`;
    } else {
      el.innerText = effect.join("");
    }

    if (iterations > text.length) clearInterval(interval);
    iterations++;
  }, 35);
}

//----------------Scroll Effects-----------------------//

const homeTitle = document.querySelector(".home-greeting");
const homeSubTitle = document.querySelector(".home-introduction p");
const aboutTitles = document.querySelectorAll(".about-title");
const projectsTitle = document.querySelectorAll(".project-title");
const downloadCV = document.querySelector(".download-cv");
const aboutContainers = document.querySelectorAll(".details-container");
const projects = document.querySelectorAll(".project");
const aboutImg = document.querySelector(".about_img-wraper");
const contactLeft = document.querySelector(".contact-left");
const contactRight = document.querySelector(".contact-right");
const sections = document.querySelectorAll("section");

const textObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        textAnimation(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

textObserver.observe(homeTitle);
textObserver.observe(homeSubTitle);
aboutTitles.forEach((title) => {
  textObserver.observe(title);
});

const scrollReveal = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    !entry.isIntersecting
      ? entry.target.classList.add("observed")
      : entry.target.classList.remove("observed");
  });
});

aboutContainers.forEach((container) => {
  scrollReveal.observe(container);
});
projects.forEach((project) => {
  scrollReveal.observe(project);
});
scrollReveal.observe(aboutImg);
scrollReveal.observe(contactLeft);
scrollReveal.observe(contactRight);
scrollReveal.observe(downloadCV);

window.onscroll = () => {
  sections.forEach((section) => {
    const offsetTop = section.offsetTop - 500;
    const offsetBottom = section.clientHeight + offsetTop;
    const sectionId = section.getAttribute("id");
    
    if(window.scrollY > 300){
      scrollTop.classList.add('show')
    }else{
      scrollTop.classList.remove('show')
    }


    if (window.scrollY > offsetTop && window.scrollY < offsetBottom) {
      const navSection = document.querySelector(
        `.nav-list a[href="#${sectionId}"]`
      );
      manageActiveClass(navSections, navSection);
    }
  });
};
