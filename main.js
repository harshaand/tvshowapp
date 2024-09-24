window.addEventListener("load", function () {
    const index_page_body = document.querySelector('.index-page-body');
    const container_search = document.querySelector('.container-search');
    const headings_search = document.querySelector(".headings-search");
    const form = document.querySelector('form')
    const search_bar = document.querySelector(".search-bar");
    const input = document.querySelector("#search-input");
    const search_bar_placeholder = document.querySelector('.search-bar-placeholder');
    const section_results = document.querySelector(".section-results");
    let first_user_search = true;

    form.addEventListener('submit', getResults)
    /* ----------------------- Search functionality -----------------------  */
    function getResults(event) {
        event.preventDefault();

        const promise = window.fetch(
            "https://api.tvmaze.com/search/shows?q=" + input.value,
            { method: "Get" });


        promise.then((data) => {
            const json = data.json();
            json.then(function (data) {
                let html_injection = '';
                if (data.length !== 0) {
                    for (var i = 0; i < data.length; i++) {
                        const show = data[i].show
                        const image_string = show.image !== null ? show.image.medium : "images/error.png"
                        let genre_string = show.genres.join(", ");

                        html_injection += `
                        <a href="show.html?id=${show.id}" class="card">
                            <div>
                                <img class="card-poster" src="${image_string}" />
                            </div>
                            <div class="card-info">
                                <h3 class="card-title">${show.name}</h3>
                                <div class="card-genre-tags">${genre_string}</div>
                            </div>
                        </a>
                    `
                    }
                    if (first_user_search === true) {
                        html_injection = `<div class='container-cards'>${html_injection}</div>`;
                        //Have to wait for animation (to finish) before injecting html
                        searchAnimation(html_injection);
                        first_user_search = false;
                    } else {
                        html_injection = `<div class='container-cards'>${html_injection}</div>`;
                        section_results.innerHTML = html_injection;
                    }
                }
                else {
                    html_injection = `<h2 class='search-error-text'>No results, please try again </h2>`
                    section_results.innerHTML = html_injection;
                }
            });
        });
    };

    /* ----------------------- Search animation -----------------------  */
    function searchAnimation(html_injection) {
        //Calculating search bar's absolute y poisiton
        //That'll be the start poisition for search bar animation
        const rect = search_bar.getBoundingClientRect();
        const scroll_top = window.pageYOffSet || document.documentElement.scrollTop;
        const search_bar_y_poisition = rect.top + scroll_top;

        document.documentElement.style.setProperty('--search-bar-start-position', search_bar_y_poisition + 'px');
        document.documentElement.style.setProperty('--search-bar-end-position', 'var(--search-bar-margin-after-animation)');
        document.documentElement.style.setProperty('--search-bar-width', 'var(--container-width)');


        headings_search.classList.add("headings-fade");
        document.querySelector('.background-image').style.opacity = '0';
        search_bar_placeholder.style.display = 'block';
        search_bar.classList.add("search-bar-animation");
        //If first search is successful, the page will not have this element so will throw an error
        if (document.querySelector('.search-error-text')) {
            document.querySelector('.search-error-text').style.opacity = '0';
        }

        search_bar.addEventListener('animationend', () => {
            headings_search.style.display = 'none';
            search_bar_placeholder.style.display = 'none';
            search_bar.classList.remove("search-bar-animation");
            container_search.style.marginTop = 'var(--search-bar-margin-after-animation)';
            index_page_body.style.justifyContent = 'flex-start';

            section_results.innerHTML = html_injection;
        });


    }

    /* ----------------------- Search bar typing animation -----------------------  */
    const shows = ["Breaking Bad", "Game of Thrones", "White Lotus", "Black Mirror"];
    const typing_speed = 150;
    const erasing_speed = 100;
    const delay_between_shows = 1000;
    const show_pause = 2000;

    let show_index = 0;
    let char_index = 0;
    let type_show_timeout;
    let erase_show_timeout;

    function typeShow() {
        if (char_index < shows[show_index].length) {
            input.placeholder += shows[show_index].charAt(char_index);
            char_index++;
            type_show_timeout = setTimeout(typeShow, typing_speed);
        } else {
            type_show_timeout = setTimeout(eraseShow, show_pause);
        }
    }

    function eraseShow() {
        if (char_index > 0) {
            input.placeholder = shows[show_index].substring(0, char_index - 1);
            char_index--;
            erase_show_timeout = setTimeout(eraseShow, erasing_speed);
        } else {
            show_index = (show_index + 1) % shows.length; // resets to 0 when show_index = show.length
            erase_show_timeout = setTimeout(typeShow, delay_between_shows);
        }
    }

    function clearInput() {
        clearTimeout(type_show_timeout);
        clearTimeout(erase_show_timeout);
        char_index = 0;
        input.placeholder = '';
    }

    input.addEventListener('focus', clearInput);
    input.addEventListener('blur', typeShow);
    typeShow();

});




