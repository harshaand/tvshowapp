const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');


window.addEventListener("load", function () {
    /* ----------------------- Show overview section -----------------------  */
    const section_show_overview = document.querySelector(".section-show-overview");
    const promise_info = window.fetch(
        "https://api.tvmaze.com/shows/" + id,
        { method: "Get" });

    promise_info.then((data) => {
        const json = data.json();
        json.then((data) => {
            section_show_overview.innerHTML = `
            <div class="section-background-div" style="background-image: url('${data.image.medium}');">
                <div class="container-show-overview">
                    <div class="show-name-poster-fav">
                        <a href="index.html" class="back-button">BACK</a>
                        <div class="show-poster-div"><img class="show-poster" src="${data.image.medium}" alt="">
                        </div>
                        <div class="show-information">
                            <div class="show-title-fav">
                                <h1 class="show-title">${data.name}</h1>
                                <div class="show-fav">
                                    <button id="fav-btn" class="show-fav-btn">
                                        <svg class="star-svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path id='starrr' class="star" fill="black" stroke="red" stroke-linecap="round"
                                                stroke-linejoin="round" stroke-width="0.5"
                                                d="M10.2135354,0.441329894 L12.5301907,5.09668871 C12.6437709,5.3306716 12.8673229,5.49423715 13.1274534,5.53368599 L18.3127795,6.28282419 C18.5232013,6.31151358 18.713271,6.4218659 18.8407265,6.58934431 C18.9681821,6.75682272 19.0224584,6.9675444 18.9914871,7.17465538 C18.9654336,7.34490401 18.8826605,7.50177662 18.7562018,7.62057098 L15.0006864,11.2592422 C14.8108765,11.4385657 14.7257803,11.7002187 14.7744505,11.9548706 L15.679394,17.0828999 C15.7448774,17.5054355 15.4552147,17.9019154 15.0278347,17.9747311 C14.8516089,18.001936 14.6711642,17.9738576 14.5120169,17.8944663 L9.88775575,15.4776038 C9.65675721,15.3522485 9.37670064,15.3522485 9.1457021,15.4776038 L4.49429266,17.9123029 C4.1040442,18.1096521 3.62530757,17.962958 3.41740993,17.5823254 C3.33635184,17.4288523 3.30778438,17.2536748 3.33596502,17.0828999 L4.24090849,11.9548706 C4.28467865,11.7005405 4.20030563,11.441111 4.01467262,11.2592422 L0.23200891,7.62057098 C-0.0773363034,7.31150312 -0.0773363034,6.81484985 0.23200891,6.50578199 C0.358259148,6.3905834 0.515216648,6.31324177 0.684480646,6.28282419 L5.86980673,5.53368599 C6.12870837,5.49136141 6.35105151,5.32868032 6.46706943,5.09668871 L8.78372471,0.441329894 C8.87526213,0.25256864 9.04026912,0.108236628 9.24131794,0.0410719808 C9.44236677,-0.0260926667 9.66241783,-0.0103975019 9.85155801,0.0845974179 C10.0076083,0.16259069 10.1343954,0.287540724 10.2135354,0.441329894 Z"
                                                transform="translate(2.5 3)"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="show-description show-description-tablet">${data.summary}</div>
                        </div>
                        <div class="show-description show-description-mobile">${data.summary}</div>
                    </div>
                    <div class="show-description show-description-desktop">${data.summary}</div>
                </div>
            </div>
            `
            initialiseFavButton();
        });
    });
    /* ----------------------- Error catcher -----------------------  */
    function catchPromiseRejection(slider) {
        let html_injection = "";
        console.log("oopsy");
        html_injection = html_injection + `
            <div class='no-results'>
                <svg class='no-results-icon'>
                    <use href="#error-svg"></use>
                </svg>
                <h3>No Results </h3>
            </div>
            <div class="card-show-info"></div>`

        slider.innerHTML = html_injection;
    }

    /* ----------------------- Cast - show info section -----------------------  */
    const cast_slider = document.querySelector("#cast-slider");
    const cast_left_btn = document.querySelector("#cast-left-btn");
    const cast_right_btn = document.querySelector("#cast-right-btn");


    const promise_cast = window.fetch(
        "https://api.tvmaze.com/shows/" + id + "/cast",
        { method: "Get" });

    promise_cast.then((data) => {
        const json = data.json();
        json.then((data) => {
            let html_injection = "";
            for (var i = 0; i < data.length; i++) {
                const imageString = data[i].person.image.medium !== null ? data[i].person.image.medium : "images/error.png"

                html_injection = html_injection + `
                    <div class="card-show-info">
                        <img class="card-poster-show-info" src="${imageString}" alt="">
                        <div class="card-info-div-show-info">
                            <h3 class="card-title-show-info">${data[i].person.name}</h3>
                            <h4 class="card-title-extra">(${data[i].character.name})</h4>
                        </div>
                    </div>`
            }
            cast_slider.innerHTML = html_injection;
            updateSliderBtnVisibility(cast_slider, cast_left_btn, cast_right_btn);

        }).catch(() => {
            catchPromiseRejection(cast_slider)
            updateSliderBtnVisibility(cast_slider, cast_left_btn, cast_right_btn);
        });
    });

    /* ----------------------- Seasons - show info section -----------------------  */
    const seasons_slider = document.querySelector("#seasons-slider");
    const seasons_left_btn = document.querySelector("#seasons-left-btn");
    const seasons_right_btn = document.querySelector("#seasons-right-btn");


    const promise_seasons = window.fetch(
        "https://api.tvmaze.com/shows/" + id + "/seasons",
        { method: "Get" });



    promise_seasons.then((data) => {
        const json = data.json();

        json.then((data) => {
            let html_injection = "";
            for (var i = 0; i < data.length; i++) {
                // ternary operator
                const imageString = data[i].image !== null ? data[i].image.medium : "images/error.png"

                html_injection = html_injection + `
                    <div class="card-show-info">
                        <img class="card-poster-show-info" src="${imageString}" alt="">
                        <div class="card-info-div-show-info">
                            <h3 class="card-title-show-info">Season ${data[i].number}</h3>
                        </div>
                    </div>
                `
            }
            seasons_slider.innerHTML = html_injection;
            updateSliderBtnVisibility(seasons_slider, seasons_left_btn, seasons_right_btn);



        }).catch(() => {
            catchPromiseRejection(seasons_slider)
            updateSliderBtnVisibility(seasons_slider, seasons_left_btn, seasons_right_btn);
        });
    });
    /* ----------------------- Show favourite (button) -----------------------  */
    let fav_btn = document.querySelector('#fav-btn');
    let star = document.querySelector('.star');
    let show_fav;

    function initialiseFavButton() {
        fav_btn = document.querySelector('#fav-btn');
        star = document.querySelector('.star');
        show_fav = 'show' + id;
        fav_btn.addEventListener('click', setFavShow);
        displayFavShow();
    }

    function setFavShow() {
        if (localStorage.getItem(show_fav) === null) {
            localStorage.setItem(show_fav, 'true');
            star.classList.add('star-filled');
        }

        else if (localStorage.getItem(show_fav) === 'false') {
            localStorage.setItem(show_fav, 'true');
            star.classList.add('star-filled');
        }

        else if (localStorage.getItem(show_fav) === 'true') {
            localStorage.setItem(show_fav, 'false');
            star.classList.remove('star-filled');
        }
    }

    function displayFavShow() {
        const value = localStorage.getItem(show_fav);

        if (value === 'false') {
            star.classList.remove('star-filled');
        }
        else if (value === 'true') {
            star.classList.add('star-filled');
        }
    }

    /* ----------------------- Sliders - show info section -----------------------  */

    function updateSliderBtnVisibility(slider, left_btn, right_btn) {
        function updateButtonVisibility() {
            const container_cards_show_info = document.querySelector(".container-cards-show-info");
            const container_width = parseFloat(window.getComputedStyle(container_cards_show_info).width);
            const cards = document.querySelector(".card-show-info");
            const cards_width = parseFloat(window.getComputedStyle(cards).width);

            cast_left_btn.onclick = () => { cast_slider.scrollLeft -= (container_width - (cards_width / 2)); };
            cast_right_btn.onclick = () => { cast_slider.scrollLeft += (container_width - (cards_width / 2)); };
            seasons_left_btn.onclick = () => { seasons_slider.scrollLeft -= (container_width - (cards_width / 2)); };
            seasons_right_btn.onclick = () => { seasons_slider.scrollLeft += (container_width - (cards_width / 2)); };

            if (slider.scrollLeft === 0) {
                left_btn.style.visibility = 'hidden';

            } else {
                left_btn.style.visibility = 'visible';
            }

            if (slider.clientWidth > slider.scrollWidth) {
                right_btn.style.visibility = 'hidden';
            }
            if (slider.scrollLeft > 0 && slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
                right_btn.style.visibility = 'hidden';

            }
            else {
                right_btn.style.visibility = 'visible';
            }

            if (slider.scrollWidth < container_width) {
                left_btn.style.visibility = 'hidden';
                right_btn.style.visibility = 'hidden';
            }


        }
        slider.addEventListener('scroll', updateButtonVisibility);
        updateButtonVisibility();

        // Create a ResizeObserver
        const resizeObserver = new ResizeObserver(entries => { updateButtonVisibility(); });

        // Start observing the resizableDiv for size changes
        resizeObserver.observe(slider);

    }

});


