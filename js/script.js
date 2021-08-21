let question = [];
let categoryTitle = '';

// fetch all the data from api
function fetchData() {
    fetch('https://jservice.io/api/clues ')
        .then((response) => response.json())
        .then((data) => {
            // console.log(data)

            // get the random category
            const random = data[Math.floor(Math.random() * data.length)]; // shuffling the api response
            let categoryID = random.category.id;
            categoryTitle = random.category.title;
            console.log('categoryTitle', random.category.title);

            // fetch particular category question from api
            fetch(`https://jservice.io/api/category?id=${categoryID}`)
                .then((response) => response.json())
                .then((categoryData) => {
                    console.log('category questions', categoryData);
                    question = categoryData.clues;
                });
            // question = data
        });
}

let shuffledQuestions = []; //empty array to hold shuffled selected questions

function handleQuestions(index) {
    /*function to shuffle  Questions array
     select random question from selected category */
    const random = question[Math.floor(Math.random() * question.length)];

    if (!shuffledQuestions.some((e) => e.id === random.id)) {
        /* if this question  is not already aksed push to shuffledQuestions */
        shuffledQuestions.push(random);
    } else if (
        shuffledQuestions.some((e) => e.id === random.id) &&
        shuffledQuestions.length !== question.length
    ) {
        /* if this question is already asked but all question from this category is not completed 
        increase the index to get another question which is not asked already*/
        return handleQuestions(++index);
    } else if (shuffledQuestions.length === question.length) {
        /* next category question as this category qns is finished
         here all the category questions are completed, so restart game with new random category */
        shuffledQuestions = [];
        document.getElementById('nextCategory').style.backgroundColor = 'green';
        document.getElementById('nextCategory').innerHTML =
            'At End of this Category ! Starting New Game with New Category...';
        setTimeout(function () {
            $('#nextCategory').html('');
        }, 3000);

        document.getElementById('categoryCompleted').innerHTML =
            'Congratulations !! This Category Completed. Be Ready For another Category Quiz';

        return handleEndGame();
    }

    const currentQuestion = shuffledQuestions[shuffledQuestions.length - 1];
    document.getElementById('question-number').innerHTML = questionNumber;
    document.getElementById('player-score').innerHTML = playerScore;

    /* to check if the question field exists in api response
     if not select next question*/
    if (
        (currentQuestion && currentQuestion.question === '') ||
        currentQuestion.question === null
    ) {
        console.log(index, currentQuestion);
        handleQuestions(++index);
    } else {
        console.log(index, currentQuestion);
        document.getElementById('display-question').innerHTML =
            currentQuestion.question;
        document.getElementById(
            'display-category'
        ).innerHTML = `[${categoryTitle}]`;
    }
}

// inital default values
let questionNumber = 1;
let playerScore = 0;
let wrongAttempt = 0;
let indexNumber = 0;

// function for displaying next question in the array to dom
function NextQuestion(index) {
    document.getElementById('display-question').innerHTML =
        'Loading Question.... Please Wait !'; // during waiting of qns show proper message to user
    document.getElementById('display-category').innerHTML = ``;

    setTimeout(() => {
        handleQuestions(index);
    }, 2000);
}

function checkForAnswer() {
    const currentQuestion = shuffledQuestions[indexNumber]; //gets current Question
    const currentQuestionAnswer = currentQuestion.answer; //gets current Question's answer
    const answer = document.getElementById('inputAnswer'); //gets enter answer in the inputField

    //checking to make sure answer has been given
    if (answer.value === '') {
        document.getElementById('option-modal').style.display = 'flex';
    }

    // converting to lowercase so igonring cases in case of right answer
    let givenAnswer = answer.value.toLowerCase();
    let actualAnswer = currentQuestionAnswer.toLowerCase();

    // checking if checked radio button is same as answer
    if (givenAnswer && givenAnswer === actualAnswer) {
        // proper message after right answer submittion
        document.getElementById('demo').style.backgroundColor = 'green';
        document.getElementById('demo').innerHTML =
            'Correct Answer ! Be Ready For Next Question';
        setTimeout(function () {
            $('#demo').html('');
        }, 3000);

        playerScore++; // increase score
        indexNumber++; // increase index
        questionNumber++; // increase questionNumber

        // get next question in case of correct answer
        handleNextQuestion();
    } else if (answer.value && answer.value !== currentQuestionAnswer) {
        // proper message after wrong answer submittion
        document.getElementById('demo').style.backgroundColor = 'red';
        document.getElementById('demo').innerHTML = 'Wrong Answer !';
        document.getElementById('categoryCompleted').innerHTML = '';

        // snackabar message display for 3 sec
        setTimeout(function () {
            $('#demo').html('');
        }, 3000);
        wrongAttempt++;

        // end in case of wrong answer with score and other message
        setTimeout(() => {
            handleEndGame();
        }, 3500);
    }
    var result = document.getElementById('inputAnswer');
    result.value = '';
}

//called when the next button is called
function handleNextQuestion() {
    /* checkForAnswer()
    delays next question displaying for a second */
    setTimeout(() => {
        NextQuestion(indexNumber);
    }, 100);
}

// function for when all questions being answered
function handleEndGame() {
    shuffledQuestions = [];
    //data to display to score board
    document.getElementById('wrong-answers').innerHTML = wrongAttempt;
    document.getElementById('right-answers').innerHTML = playerScore;
    document.getElementById('score-modal').style.display = 'flex';
}

//closes score modal and resets game
function closeScoreModal() {
    questionNumber = 1;
    playerScore = 0;
    wrongAttempt = 0;
    indexNumber = 0;
    shuffledQuestions = [];
    fetchData();
    NextQuestion(indexNumber);
    document.getElementById('score-modal').style.display = 'none';
}

//function to close warning modal
function closeOptionModal() {
    document.getElementById('option-modal').style.display = 'none';
}