/**
 *
 * <iframe width="560" height="315" src="https://www.youtube.com/embed/s7L2PVdrb_8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
 * https://www.youtube.com/watch?v=s7L2PVdrb_8
 * The Data is saved by the code s7L2PVdrb_8
 *
 */
/** 15 sek duration */

/** String zusammensetzung
 * ROOT : https://www.youtube.com/watch?=
 * VIDKEY : gmyCRJkKeKs
 *
 */
let shuffledArrOfShows
let fiveShows
let correctAnswer
let gameRoundQuestion
let showType
let timerInterval
let currentPoints

window.onload = () => {
	//TODO Sometimes the same card is two - three times in there

	fiveShows = getFiveObjsFromArr(getShuffledCardsByType())
	gameRoundQuestion = generateGameQuestions(fiveShows)
	playGame(gameRoundQuestion)
	let guessSeconds = 20
	let display = document.querySelector("#timer")
	timerCountdown(guessSeconds, display)
}

function shuffleShowArr(tvShowsArr) {
	for (let i = tvShowsArr.length - 1; i > 1; i--) {
		let j = Math.round(Math.random() * i)
		let tempCard = tvShowsArr[i]
		tvShowsArr[i] = tvShowsArr[j]
		tvShowsArr[j] = tempCard
	}
	return tvShowsArr
}

function getFiveObjsFromArr(shuffledArrOfShows) {
	return shuffledArrOfShows.slice(5)
}

function getShuffledCardsByType() {
	showType = sessionStorage["showType"]

	let shuffledTVShows
	if (showType === "tvShows") {
		shuffledTVShows = shuffleShowArr(collectionOfShows.tvShows)
	} else if (showType === "disneyShows") {
		shuffledTVShows = shuffleShowArr(collectionOfShows.disneyShows)
	} else if (showType === "animeShows") {
		shuffledTVShows = shuffleShowArr(collectionOfShows.animeShows)
	} else {
		shuffledTVShows = shuffleShowArr(collectionOfShows.tvShows)
	}
	return shuffledTVShows
}

function generateGameQuestions(fiveShows) {
	// Shuffle TV Show
	let shuffledTVShows = getShuffledCardsByType(),
		counter = 0,
		listOfQuestions = [],
		questions = []
	for (let show of fiveShows) {
		questions = []
		questions.push(show)
		shuffledTVShows = shuffleShowArr(shuffledTVShows)
		for (let i = 0; i < shuffledTVShows.length; i++) {
			if (counter >= 3) {
				counter = 0
				break
			}

			if (show.title !== shuffledTVShows[i].title) {
				counter++
				questions.push(shuffledTVShows[i])
			}
		}

		listOfQuestions.push([questions])
	}
	return listOfQuestions
}

function playGame(gameRoundQuestions) {
	parseInt(document.querySelector("#current-round").innerHTML) - 1
	correctAnswer = gameRoundQuestions[0][0][0].title

	let shuffleGameArr = shuffleShowArr(gameRoundQuestions[0][0])
	changeElementOnWebpage(shuffleGameArr)
	document.getElementById("hint-text").innerHTML = ""
}

function changeElementOnWebpage(gameArr) {
	parseInt(document.querySelector("#current-round").innerHTML) - 1
	let soundtrackKey = ""
	gameArr.forEach((showObj, index) => {
		document.querySelector(`#answer-img-${index}`).src = showObj.img
		document.querySelector(`#answer-title-${index}`).innerHTML = showObj.title
		if (showObj.title === correctAnswer) {
			soundtrackKey = showObj.soundtrack
		}
	})
	removeClickedStyles()

	document.querySelector(".youtube-player").src = soundtrackKey
}

function getSolidEmbedYTUrl(soundtrackKey) {
	return `https://www.youtube.com/embed/${soundtrackKey}&autoplay=1&mute=0`
}

function displayModal() {
	let modal = document.getElementById("myModal")
	let successMessage = document.querySelector(".success-message > p")
	let messageTitle = document.querySelector(".success-message > h3")
	//TODO Rename successMessage to messageBody
	if (currentPoints <= 5) {
		messageTitle.classList.add("text-red-500")
		messageTitle.innerHTML = "<strong> Failure </strong>"
		successMessage.innerHTML = "What are you doing? Finally watch these shows!!!"
	} else if (currentPoints > 5) {
		messageTitle.classList.add("text-green-500")
		messageTitle.innerHTML = "<strong> SUCCESS </strong>"

		successMessage.innerHTML = "You are a person of Culture"
	}

	modal.style.display = "block"
	clearInterval(timerInterval)
	document.querySelector(".youtube-player").src = ""
	throw new Error("The Game has stopped, because you must select from the Button")
}

function removeModal() {
	let modal = document.getElementById("myModal")
	modal.style.display = "hidden"
}

function checkAnswer() {
	let round = parseInt(document.querySelector("#current-round").innerHTML)
	let maxRound = parseInt(document.querySelector("#max-round").innerHTML)

	document.querySelectorAll(".answer-title").forEach((cardTitle) => {
		let isCardSelected =
			cardTitle.classList.contains("bg-yellow-300") &&
			cardTitle.classList.contains("text-indigo-500")
		let currentRound
		if (isCardSelected) {
			if (cardTitle.innerHTML === correctAnswer) {
				document.querySelector("#current-round").innerHTML = round++
				clearInterval(timerInterval)
				let display = document.querySelector("#timer")
				timerCountdown(15, display)

				currentRound = document.querySelector("#current-round").innerHTML

				currentPoints = parseInt(document.querySelector("#point").innerHTML) + 5
				document.querySelector("#point").innerHTML = currentPoints
				gameRoundQuestion.shift()
				playGame(gameRoundQuestion)
			} else {
				currentPoints = parseInt(document.querySelector("#point").innerHTML) - 2
				document.querySelector("#point").innerHTML = currentPoints
			}
		}
	})
	document.querySelector("#current-round").innerHTML = round
	if (round > maxRound) {
		document.querySelector("#current-round").innerHTML = 5
		displayModal()
	}
}

function giveHint() {
	fiveShows.forEach((show) => {
		if (show.title === correctAnswer) {
			document.querySelector("#hint-text").innerHTML = show.descr
		}
	})
	currentPoints = parseInt(document.querySelector("#point").innerHTML) - 2
	document.querySelector("#point").innerHTML = currentPoints
}

function addPulseAnimation() {
	document.querySelectorAll(".answer-option").forEach((showCard) => {
		showCard.classList.add("animate-pulse")
	})
}

function removePulseAnimation() {
	document.querySelectorAll(".answer-option").forEach((showCard) => {
		showCard.classList.remove("animate-pulse")
	})
}

function getTheTypeOfCards() {
	showType = sessionStorage["showType"]

	if (showType === "tvShows") {
		return collectionOfShows.tvShows
	} else if (showType === "disneyShows") {
		return collectionOfShows.disneyShows
	} else if (showType === "animeShows") {
		return collectionOfShows.animeShows
	} else {
		return collectionOfShows.tvShows
	}
}

function timerCountdown(duration, display) {
	var timer = duration,
		seconds
	timerInterval = setInterval(function () {
		seconds = parseInt(timer % 60, 10)

		display.textContent = seconds
		if (--timer < 0) {
			let currentRound = document.querySelector("#current-round").innerHTML
			if (currentRound === "5") {
				displayModal()
				clearInterval(timerInterval)
			} else {
				currentPoints = parseInt(document.querySelector("#point").innerHTML) - 5
				document.querySelector("#current-round").innerHTML =
					parseInt(document.querySelector("#current-round").innerHTML) + 1
				document.querySelector("#point").innerHTML = currentPoints
				shuffledArrOfShows = shuffleShowArr(getTheTypeOfCards())
				fiveShows = getFiveObjsFromArr(shuffledArrOfShows)
				gameRoundQuestion = generateGameQuestions(fiveShows)
				playGame(gameRoundQuestion)

				timer = duration
			}
		}
	}, 1000)
}

function clickedCard(cardNumber) {
	removePulseAnimation()
	removeClickedStyles()
	let clickedCardOutlined = document.querySelectorAll(".answer-option")[cardNumber]
	let clickedTVTitle = document.querySelectorAll(".answer-title")[cardNumber]

	clickedCardOutlined.classList.add("border-8")
	clickedCardOutlined.classList.add("border-yellow-300")
	clickedTVTitle.classList.add("bg-yellow-300")
	clickedTVTitle.classList.add("text-indigo-500")
}

function removeClickedStyles() {
	document.querySelectorAll(".answer-option").forEach((card) => {
		card.classList.remove("border-8")
		card.classList.remove("border-yellow-300")
	})

	document.querySelectorAll(".answer-title").forEach((title) => {
		title.classList.remove("bg-yellow-300")
		title.classList.remove("text-indigo-500")
	})
}

function refreshCurrentWindow() {
	window.location.reload()
}
