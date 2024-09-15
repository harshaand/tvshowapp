window.addEventListener("load", function () {
    const input = document.querySelector("#search-input");
    const search = document.querySelector("#search-button");
    const section_results = document.querySelector(".section-results");
    const form = document.querySelector('form')

    form.addEventListener('submit', getResults)

    function getResults(event) {
        event.preventDefault();

        const promise = window.fetch(
            "https://api.tvmaze.com/search/shows?q=" + input.value,
            { method: "Get" });


        promise.then(function (data) {
            const json = data.json();



            json.then(function (data) {
                console.log(data);
                let htmlinjection = "";
                console.log(data.length);

                for (var i = 0; i < data.length; i++) {
                    const show = data[i].show
                    const imageString = show.image !== null ? show.image.medium : "images/error.png"
                    let genreString = show.genres.join(", ");

                    htmlinjection = htmlinjection + `
                    <a href="movie.html?id=${show.id}" class="card">
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
                section_results.innerHTML = `
                <h2 class="heading-results">Results</h2>
                <div class="container-cards">` + htmlinjection + "</div>";
            });
        });
    };

    /* ----------------------- Search bar animation -----------------------  */
    const films = ["Twilight", "Moonlight", "Nightcrawler"];
    const typingSpeed = 150;
    const erasingSpeed = 100;
    const delayBetweenFilms = 1000;
    const filmPause = 2000;

    let filmIndex = 0;
    let charIndex = 0;
    let typeFilmTimeout;
    let eraseFilmTimeout;

    function typeFilm() {
        if (charIndex < films[filmIndex].length) {
            input.placeholder += films[filmIndex].charAt(charIndex);
            //films[filmIndex][charIndex]
            charIndex++;
            typeFilmTimeout = setTimeout(typeFilm, typingSpeed);
        } else {
            typeFilmTimeout = setTimeout(eraseFilm, filmPause);
        }
    }

    function eraseFilm() {
        if (charIndex > 0) {
            input.placeholder = films[filmIndex].substring(0, charIndex - 1);
            charIndex--;
            eraseFilmTimeout = setTimeout(eraseFilm, erasingSpeed);
        } else {
            filmIndex = (filmIndex + 1) % films.length; // resets to 0 when filmIndex = film.length
            eraseFilmTimeout = setTimeout(typeFilm, delayBetweenFilms);
        }
    }

    function clearInput() {
        clearTimeout(typeFilmTimeout);
        clearTimeout(eraseFilmTimeout);
        charIndex = 0;
        input.placeholder = '';
    }

    input.addEventListener('focus', clearInput);
    input.addEventListener('blur', typeFilm);
    typeFilm();

});







