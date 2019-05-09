// functionality for hero slide header icon
		var items = document.querySelectorAll(".hero article");
		var header = document.querySelector("header");
		var hero = document.querySelector(".hero");
		var icon = document.querySelector("header .icon");
			var iconTop = document.querySelectorAll(".iconTop");
			var iconMiddle = document.querySelectorAll(".iconMiddle");
			var iconBottom = document.querySelectorAll(".iconBottom");
			var iconDot = document.querySelectorAll(".iconDot");
		var backArrow = document.querySelector("#backArrow");
		var bottomArrow = document.querySelector("#bottomArrow");
		var title = document.querySelector(".title");
		var clicked = false;
		var windowHeight = (window.innerHeight || document.documentElement.clientHeight);

// add id's to printContainers
		var printContainers = document.querySelectorAll(".printContainer");
		var printContainerCounter = 1;
		printContainers.forEach(printContainer => {
			printContainer.id = `printContainer${printContainerCounter}`;
			// console.log(printContainer.id);
			printContainerCounter += 1;
		});

// change icon color on hover
		icon.addEventListener("mouseover", () => {
			iconTop.forEach(path => path.style.fill = "var(--green3)");
			iconMiddle.forEach(path => path.style.fill = "var(--green2)");
			iconBottom.forEach(path => path.style.fill = "var(--green1)");
			iconDot.forEach(path => path.style.fill = "var(--green4)");
		});
	// change icon color back off hover
		icon.addEventListener("mouseleave", () => {
			iconTop.forEach(path => path.style.fill = "var(--purple3)");
			iconMiddle.forEach(path => path.style.fill = "var(--purple2)");
			iconBottom.forEach(path => path.style.fill = "var(--purple1)");
			iconDot.forEach(path => path.style.fill = "var(--purple4)");
		});

		function addListeners() {
			items.forEach(item => {
				var itemName = item.id;
				var itemProject = document.getElementById(`${itemName}Project`);
// set background image of hero as articles on hovered
				item.addEventListener("mouseover", () => {
					if (clicked == false) {
						hero.style.background = `url("assets/images/${itemName}.jpg")`;
						hero.style.backgroundSize = "cover";
						hero.style.backgroundRepeat = "no-repeat";
						hero.style.backgroundPosition = "center";
					}
				});
	// reset background off hover
				item.addEventListener("mouseleave", () => {
					if (clicked == false) {
						hero.style.background = "url('assets/images/prints/background-stripe-black.png')";

					}
				});
// if clicked move hero to the left and open clicked article
				item.addEventListener("click", () => {
					hero.style.position = "absolute";
					hero.style.backgroundImage = `url("assets/images/${itemName}.jpg")`;
					header.scrollIntoView();
					hero.style.transform = "translateX(-100%)";
					itemProject.classList.add("active");
					backArrow.style.left = "0";
					clicked = true;
// check if itemProject contains a slideBox, sets up slideBox if true
				});
				if (itemProject.contains(itemProject.querySelector(".slideBox"))) { 
					var slideBoxes = itemProject.querySelectorAll(".slideBox");
					slideBoxes.forEach(slideBox => {
						var slides = slideBox.querySelectorAll(".slide");
				// initialize slideBox defaults	
						if (slideBox.querySelectorAll(".showSlide").length == 0) {
							var slideCount = 0;
							var slidesTotal = slides.length;
							var currentSlide = slides[slideCount];
							currentSlide.classList.add("showSlide");
						}
				// toggle next slide display
						var onNextButtonHandler = function() {
							currentSlide.classList.remove("showSlide");
							slideCount += 1;
							slideCount = slideCount == slidesTotal ? 0 : slideCount;
							currentSlide = slides[slideCount];
							currentSlide.classList.add("showSlide");
							console.log(`slideCount: ${slideCount}`);
						}
				// toggle previous slide display
						var onPreviousButtonHandler = function() {
							currentSlide.classList.remove("showSlide");
							slideCount -= 1;
							slideCount = slideCount < 0 ? (slidesTotal - 1) : slideCount;
							currentSlide = slides[slideCount];
							currentSlide.classList.add("showSlide");
						}
				// setup eventlisteners for next/previous buttons
						var nextButton = slideBox.querySelector(".next");
						nextButton.addEventListener("click", onNextButtonHandler, false);
						var previousButton = slideBox.querySelector(".previous");
						previousButton.addEventListener("click", onPreviousButtonHandler, false);
					});
				}
			});
// backArrow clicked, remove article and move hero back into position
			backArrow.addEventListener("click", () => {
				hero.style.position = "relative";
				hero.style.transform = "translateX(0)";
				var currentItem = document.querySelector(".active");
				currentItem.classList.toggle("active");
				backArrow.style.left = "-2em";
				header.scrollIntoView();
				clicked = false;
			});
// bottomArrow clicked (for prints page), advances to next print
			if (document.querySelector(".print")) {
				bottomArrow.addEventListener("click", () => {
					var currentContainer = 0;
		// determine first printContainer with midpoint in viewport
					printContainers.forEach(printContainer => {
						var position = printContainer.getBoundingClientRect();
						var midpoint = (position.bottom - position.top) / 2 + position.top;
						if (midpoint >= 0 && currentContainer == 0) {
							currentContainer = Number(printContainer.id.match(/\d+/g));
						}
					});
		// select and scroll to midpoint of next printContainer
					var nextContainer = currentContainer + 1 < printContainerCounter ? currentContainer + 1 : 1;
					var nextPrintContainer = document.querySelector(`#printContainer${nextContainer}`);
					var nextPosition = nextPrintContainer.getBoundingClientRect();
					var nextMidpoint = (nextPosition.bottom - nextPosition.top) / 2 + nextPosition.top;
					var nextTop = nextMidpoint - (windowHeight / 2);
					window.scrollBy(0, nextTop);
				});
			}
		}

// lazyload images for print page
		document.addEventListener("DOMContentLoaded", function() {
			var lazyloadImages;

			if ("IntersectionObserver" in window) {
				lazyloadImages = document.querySelectorAll(".lazy");
				var imageObserver = new IntersectionObserver(function(entries, observer) {
					entries.forEach(function(entry) {
						if (entry.isIntersecting) {
							var image = entry.target;
							image.src = image.dataset.src
							image.classList.remove("lazy");
							image.unobserve(image);
						}
					});
				}, { root: null, rootMargin: '0 0 1000px 0'});

				lazyloadImages.forEach(function(image) {
					imageObserver.observe(image);
				});
			} else {
				var lazyloadThrottleTimeout;
				lazyloadImages = document.querySelectorAll(".lazy");

				function lazyload() {
					if (lazyloadThrottleTimeout) {
						clearTimeout(lazyloadThrottleTimeout);
					}

					lazyloadThrottleTimeout = setTimeout(function() {
						var scrollTop = window.pageYOffset;

						lazyloadImages.forEach(function(img) {
							if(img.offsetTop < (window.innerHeight + scrollTop)) {
								img.src = img.dataset.src;
								img.classList.remove("lazy");
							}
						});

						if (lazyloadImages.length == 0) {
							document.removeEventListener("scroll", lazyload);
							window.removeEventListener("resize", lazyload);
							window.removeEventListener("orientation", lazyload);
						}
					}, 20);
				}

				document.addEventListener("scroll", lazyload);
				window.addEventListener("resize", lazyload);
				window.addEventListener("orientation", lazyload);
			}
		});

		addListeners();