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

    function getResults(event) {
        event.preventDefault();

        const promise = window.fetch(
            "https://api.tvmaze.com/search/shows?q=" + input.value,
            { method: "Get" });


        promise.then(function (data) {
            const json = data.json();


            json.then(function (data) {
                let htmlinjection = '';
                if (data.length !== 0) {
                    for (var i = 0; i < data.length; i++) {
                        const show = data[i].show
                        const imageString = show.image !== null ? show.image.medium : "images/error.png"
                        let genreString = show.genres.join(", ");

                        htmlinjection += `
                    <a href="show.html?id=${show.id}" class="card">
                        <div>
                            <img class="card-poster" src="${imageString}" />
                        </div>
                        <div class="card-info">
                            <h3 class="card-title">${show.name}</h3>
                            <div class="card-genre-tags">${genreString}</div>
                        </div>
                    </a>
                    `
                    }
                    if (first_user_search === true) {
                        htmlinjection = `<div class='container-cards'>${htmlinjection}</div>`;
                        //Have to wait for animation to inject html
                        searchAnimation(htmlinjection);
                        first_user_search = false;
                    } else {
                        htmlinjection = `<div class='container-cards'>${htmlinjection}</div>`;
                        section_results.innerHTML = htmlinjection;
                    }



                }
                else {
                    htmlinjection = `<h2 class='search-error-text'>No results, please try again </h2>`
                    section_results.innerHTML = htmlinjection;
                }
            });
        });
    };

    /* ----------------------- Search animation -----------------------  */
    function searchAnimation(htmlinjection) {
        //Calculating search bar's absolute y poisiton
        //That'll be the start poisition for search bar animation
        const rect = search_bar.getBoundingClientRect();
        const scrollTop = window.pageYOffSet || document.documentElement.scrollTop;
        const search_bar_y_poisition = rect.top + scrollTop;

        document.documentElement.style.setProperty('--search-bar-start-position', search_bar_y_poisition + 'px');
        document.documentElement.style.setProperty('--search-bar-end-position', 'var(--search-bar-margin-after-animation)');
        document.documentElement.style.setProperty('--search-bar-width', 'var(--container-width)');


        headings_search.classList.add("headings-fade");
        document.querySelector('.background-image').style.opacity = '0';
        search_bar_placeholder.style.display = 'block';
        search_bar.classList.add("search-bar-animation");
        //throws an error but don't know why
        //document.querySelector('.search-error-text').style.opacity = '0';

        search_bar.addEventListener('animationend', () => {
            headings_search.style.display = 'none';
            search_bar_placeholder.style.display = 'none';
            search_bar.classList.remove("search-bar-animation");
            container_search.style.marginTop = 'var(--search-bar-margin-after-animation)';
            index_page_body.style.justifyContent = 'flex-start';

            section_results.innerHTML = htmlinjection;
        });


    }

    /* ----------------------- Search bar typing animation -----------------------  */
    const shows = ["Breaking Bad", "Game of Thrones", "White Lotus", "Black Mirror"];
    const typingSpeed = 150;
    const erasingSpeed = 100;
    const delayBetweenShows = 1000;
    const showPause = 2000;

    let showIndex = 0;
    let charIndex = 0;
    let typeShowTimeout;
    let eraseShowTimeout;

    function typeShow() {
        if (charIndex < shows[showIndex].length) {
            input.placeholder += shows[showIndex].charAt(charIndex);
            //shows[showIndex][charIndex]
            charIndex++;
            typeShowTimeout = setTimeout(typeShow, typingSpeed);
        } else {
            typeShowTimeout = setTimeout(eraseShow, showPause);
        }
    }

    function eraseShow() {
        if (charIndex > 0) {
            input.placeholder = shows[showIndex].substring(0, charIndex - 1);
            charIndex--;
            eraseShowTimeout = setTimeout(eraseShow, erasingSpeed);
        } else {
            showIndex = (showIndex + 1) % shows.length; // resets to 0 when showIndex = show.length
            eraseShowTimeout = setTimeout(typeShow, delayBetweenShows);
        }
    }

    function clearInput() {
        clearTimeout(typeShowTimeout);
        clearTimeout(eraseShowTimeout);
        charIndex = 0;
        input.placeholder = '';
    }

    input.addEventListener('focus', clearInput);
    input.addEventListener('blur', typeShow);
    typeShow();

});




