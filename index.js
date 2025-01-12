/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// Grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// Create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    for (let i = 0; i < games.length; i++) {
        const game = games[i];
        const game_card = document.createElement('div');
        game_card.classList.add('game-card');

        game_card.innerHTML = `
            <img src="${game.img}" alt="${game.name}" class="game-img">
            <h2>${game.name}</h2>
            <p>${game.description}</p>
            <p><strong>Pledged:</strong> $${game.pledged}</p>
            <p><strong>Goal:</strong> $${game.goal}</p>
            <p><strong>Backers:</strong> ${game.backers}</p>
        `;

        gamesContainer.appendChild(game_card);
    }
}

addGamesToPage(GAMES_JSON);


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((acc, game) => {
    return acc + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `$${totalContributions.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((acc, game) => {return acc + game.pledged;}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const totalGames = GAMES_JSON.reduce((acc, game) => {return acc + 1}, 0 );
gamesCard.innerHTML = `${totalGames}`

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let listOfUnfundedGames = GAMES_JSON.filter ((game) => { return game.pledged < game.goal})

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(listOfUnfundedGames);

    console.log(`Quantity of unfunded games: ${listOfUnfundedGames.length}`);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let listOfFundedGames = GAMES_JSON.filter ((game) => { return game.pledged >= game.goal})

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(listOfFundedGames);

    console.log(`Quantity of fully funded games: ${listOfFundedGames.length}`);

}


// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const getUnfundedGames = () => GAMES_JSON.filter(game => game.pledged < game.goal);
let unfundedGames = getUnfundedGames();

const countUnfundedGames = unfundedGames.reduce ((acc, unfundedGame) => {
    return acc + 1
}, 0);

console.log("Count of Unfunded Games:", countUnfundedGames)
// create a string that explains the number of unfunded games using the ternary operator

let generalStr = `A total of ${totalContributions.toLocaleString()} has been raised for ${totalGames} game${totalGames > 1 ? 's' : ''}. Currently, ${countUnfundedGames} game${countUnfundedGames > 1 ? 's' : ''} remain unfunded. We need your help to fund these amazing games!`;

// Create a new DOM element containing the template string
const description = document.createElement("p");
description.textContent = generalStr;

// Append the new DOM element to the description container
descriptionContainer.appendChild(description);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const topPledgeGame = document.createElement("p");
topPledgeGame.textContent = firstGame.name;
firstGameContainer.appendChild(topPledgeGame);
    
// do the same for the runner up item
const runnerUpPledgeGame = document.createElement("p");
runnerUpPledgeGame.textContent = secondGame.name;
secondGameContainer.appendChild(runnerUpPledgeGame);

// logic for the search bar 
const searchBar = document.getElementById("game-search");
searchBar.addEventListener('input', (e) => {
    const searchValue = e.target.value.toLowerCase();
    const chosenGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(searchValue));
    deleteChildElements(gamesContainer);
    addGamesToPage(chosenGames);
});



