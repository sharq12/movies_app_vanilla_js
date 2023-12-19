const mainContainer = document.querySelector(".main"); // main Container 
const searchEle = document.querySelector(".input"); // search bar 
const RatingEle = document.querySelector("#rating-select"); // rating 
const genreEle = document.querySelector("#genre-select"); // genre 
const URL = "https://movies-app.prakashsakari.repl.co/api/movies";

const getMovies = async (URL) => {
    try {
        const {
            data
        } = await axios.get(URL);
        return data;
    } catch (err) {
        return err;
    }
};

// function jsonFileWriter(data) {                  //     writing data into a file 
//     let stringData = JSON.stringify(data);
//     console.log(data);
//     fs.writeFileSync("movieData.json", stringData);
// };

// fetch(URL)                                           // we can use fetch(url) also in place of axios 
// .then((response)=>response.json())
// .then(data=>console.log(data))
// .catch(error=>console.log(error));

// const moviesData = await getMovies(URL);
// console.log(moviesData);

// // debugger;
// let searchValue = "";
// let filterredArr = [];

// const debounceInput = debounce(handleSearch, 600);  // debouncing (applying delay)
// searchEle.addEventListener("keyup", debounceInput);  // filtering the data on the basis of the user input on search bar 

function debounce(callback, delay) {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            callback(...args)
        }, delay);
    };
}

function handleSearch(event) {
    searchValue = event.target.value.toLowerCase().trim();
    filterredArr = searchValue ?.length > 0 ? filterredMovies(searchValue) : moviesData;
    mainContainer.innerHTML = "";
    createMovieCard(filterredArr);
    // debugger;
    console.log({
        filterredArr
    });
}

function filterredMovies(searchValue) {
    // debugger;
    let fArray = moviesData.filter((movie) =>
        movie.name.toLowerCase() === searchValue ||
        movie.director_name.toLowerCase() === searchValue ||
        movie.writter_name.toLowerCase().split(',').includes(searchValue) ||
        movie.cast_name.toLowerCase().split(',').includes(searchValue)
    );
    console.log({
        fArray
    });
    return fArray;
}
const createElement = (element) => document.createElement(element);
// debugger;
const createMovieCard = (moviesArray) => {
    for (let movie of moviesArray) {
        // moviesArray.map(movie=>{

        // card container
        const cardContainer = createElement("div");
        cardContainer.classList.add("card", "shadow");

        // cardImageContainer
        const cardImageContainer = createElement("div");
        cardImageContainer.classList.add("card-image-container");
        // ImageEle 
        const imageEle = createElement("img");
        imageEle.classList.add("card-image");
        imageEle.setAttribute("src", movie.img_link);
        imageEle.setAttribute("alt", movie.name);

        cardImageContainer.appendChild(imageEle);
        cardContainer.appendChild(cardImageContainer);


        // movieDetailContainer
        const movieDetailContainer = createElement("div");
        movieDetailContainer.classList.add("movie-details");
        // title 
        const titlePara = createElement("p");
        titlePara.classList.add("title");
        titlePara.innerText = `${movie.name} (${movie.year})`;
        movieDetailContainer.appendChild(titlePara);
        // genre 
        const genrePara = createElement("p");
        genrePara.classList.add("genre");
        genrePara.innerText = movie.genre;
        movieDetailContainer.appendChild(genrePara);
        // rating 
        const ratingContainer = createElement("div");
        ratingContainer.classList.add("rating");

        // star-rating 
        const starRatingContainer = createElement("div");
        starRatingContainer.classList.add("star-rating");

        // star span 
        const starSpan = createElement("span");
        starSpan.classList.add("material-symbols-outlined");
        starSpan.innerText = "star_rate";
        starRatingContainer.appendChild(starSpan);
        //rating span
        const spanRating = createElement("span");
        spanRating.innerText = movie.imdb_rating;
        starRatingContainer.appendChild(spanRating);

        // duration 
        const durationPara = createElement("p");
        durationPara.innerText = `${movie.duration} mins`;

        // append star rating and duration into ratingContainer 
        ratingContainer.appendChild(starRatingContainer);
        ratingContainer.appendChild(durationPara);

        // append ratingContainer to movieDetailContainer
        movieDetailContainer.appendChild(ratingContainer);

        // append movieDetailContainer to cardContainer
        cardContainer.appendChild(movieDetailContainer);

        // appneding cardContainer to mainContainer
        mainContainer.appendChild(cardContainer);

        // }
    }
    // });
}

function handleRatingSearch(event) {
    // debugger;
    let rating = event.target.value;
    filterredArr = filterredArr.length > 0 ? filterredArr.filter((movie) => movie.imdb_rating >= rating) : moviesData.filter((movie) => movie.imdb_rating >= rating);
    // filterredArr = rateArr;
    console.log(filterredArr);
    mainContainer.innerHTML = "";
    createMovieCard(filterredArr);
}

function getGenre(moviesData) {
    // debugger;
    let finalGenreArray = [];
    let genreArr = moviesData.reduce((acc, curr) => {
        let tempArr = curr.genre.split(",");
        acc = [...acc, ...tempArr];
        for (let genre of acc) {
            if (!finalGenreArray.includes(genre)) {
                finalGenreArray = [...finalGenreArray, genre];
            }
        }
        return acc;
    }, []);
    return finalGenreArray;
}

function getGenreHTML(gArr) {
    // debugger;
    let genreHTML = ``; //<option class="option" value="">Genre</option>
    gArr.map(genre => {
        genreHTML += `<option class="option" value="${genre}">${genre}</option>`
    });
    genreEle.innerHTML += genreHTML;                             
}

function handleGenreSearch(event) {
    // debugger;
    let genreValue = event.target.value;
    filterredArr = filterredArr.length > 0 ? filterredArr.filter((movie) => movie.genre.includes(genreValue)) : moviesData.filter((movie) => movie.genre.includes(genreValue));
    console.log(filterredArr);
    mainContainer.innerHTML = "";
    createMovieCard(filterredArr);
}


const moviesData = await getMovies(URL);
console.log(moviesData);

createMovieCard(moviesData);
// debugger;
let gArr = getGenre(moviesData); // creating the unique genre from the API data obtained i.e- moviesData
console.log({
    gArr
});
getGenreHTML(gArr);

let searchValue = "";
let filterredArr = [];
const debounceInput = debounce(handleSearch, 600); // debouncing (applying delay)
searchEle.addEventListener("keyup", debounceInput); // filtering the data on the basis of the user input on search bar 
RatingEle.addEventListener("change", handleRatingSearch);
genreEle.addEventListener("change", handleGenreSearch);