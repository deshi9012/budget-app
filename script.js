// function interviewQuestions(jobName) {
//     if (jobName === 'teacher') {
//         return function (name) {
//             console.log('Hello ' + name + ' you are ' + jobName);
//         }
//     } else if (jobName === 'developer') {
//         return function (name) {
//             console.log('Hello ' + name + 'you are developer');
//         }
//     } else {
//         return function (name) {
//             console.log('You are nobody');
//         }
//     }
// }console.log('------');
//         for (var i = 0; i < this.answers.length; i++) {

//             console.log(i + ':' + this.answers[i]);

//         }

// function betterInterviewQuestions(jobName) {
//     return function (name) {

//         console.log('Hello ' + name + 'you are' + jobName);
//     }
// }

// function retirement(retirementAge) {
//     var text = ' years left until retirement.';
//     return function (yearOfBirth) {
//         var age = 2016 - yearOfBirth;
//         console.log((retirementAge - age) + text);
//     }
// }
// var retirementUS = retirement(66);
// retirementUS(1990);


// var john = {
//     name: 'John',
//     job: 'teacher',
//     age: 32,
//     presentation: function (style, timeOfDay) {

//         if (style === 'formal') {
//             console.log('Good ' + timeOfDay + ', Ladies and gentleman! I\'m a ' + this.job + ' and I\'m a ' + this.age + ' years old');
//         } else {
//             console.log('Hey What\'s up.Have a nice ' + timeOfDay + '. I\'m a ' + this.job + ' and I\'m a ' + this.age + ' years old');
//         }
//     }
// }



// var emily = {
//     name: 'Emily',
//     job: 'designer',
//     age: 22
// };
// // john.presentation('formal', 'morning');
// // john.presentation.call(emily, 'formal', 'afternoon');
// var johnFriendly = john.presentation.bind(john, 'friendly');
// johnFriendly('morning');
// johnFriendly('night');

// var emilyFormal = john.presentation.bind(emily, 'formal')
// var years = [1990, 1965, 1937, 2005, 1998];

// function arrayCalc(arr, fn) {
//     var arrRes = [];
//     for (var i = 0; i < arr.length; i++) {
//         arrRes.push(fn(arr[i]));
//     }
//     return arrRes;
// }

// function calculateAge(year) {
//     return 2016 - year;
// }

// function isFullAge(limit, age) {

//     return age >= limit;
// }

// var ages = arrayCalc(years, calculateAge);

// var fullJapan = arrayCalc(ages, isFullAge.bind(this, 20));
// console.log(ages);
// console.log(fullJapan);



// MY solutuon
// function Question(question, answers, correctAnswer) {
//     this.question = question;
//     this.answers = answers;
//     this.correctAnswer = correctAnswer;
//     this.askQuestion = function () {
//         console.log(this.question);
//         
//         var answer = prompt(this.question);
//         if (this.checkAnswer(answer)) {

//             console.log(score);
//             loopQuestions();
//         }

//     };
//     this.checkAnswer = function (answer) {
//         if (answer === this.correctAnswer) {
//             score++;
//             console.log('correct');
//             return true;
//         } else if (answer === 'exit') {
//             return false;
//         } else {

//             console.log('uncorrect');
//             return true;

//         }
//     }
// }

// function randQuestion(questionsLength) {

//     return Math.floor(Math.random() * questionsLength);
// }


// var firstQuestion = new Question('What is my name?', ['ilia', 'alex', 'petar'], 'ilia');

// var questions = [new Question('What is my name?', ['ilia', 'alex', 'petar'], 'ilia'), new Question('is javascript is cool?', ['yes', 'no', 'dont know'], 'yes'), new Question('What is instructor name?', ['ilia', 'jonas', 'Habibi'], 'jonas')];
// var score = 0;


// function loopQuestions() {
//     questions[randQuestion(questions.length)].askQuestion();
// }

// loopQuestions();
//Jonas Solutio
(function () {
    function Question(question, answers, correctAnswer) {
        this.question = question;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    };

    Question.prototype.displayQuestion = function () {
        console.log(this.question);
        console.log('------');
        for (var i = 0; i < this.answers.length; i++) {

            console.log(i + ':' + this.answers[i]);

        }

    };
    Question.prototype.checkAnswer = function (answer, callback) {
        var sc;
        if (answer === this.correctAnswer) {

            console.log('correct');
            sc = callback(true);
            // return true;
        } else {

            console.log('uncorrect');
            sc = callback(false);
            // return false;

        }
        this.displayScore(sc);
    };
    Question.prototype.displayScore = function (score) {
        console.log(score);
    }
    var q1 = new Question('is javascript is cool?', ['yes', 'no'], 0);

    var q2 = new Question('What is my name?', ['alex', 'ilia', 'petar'], 1);
    var q3 = new Question('What is best describe coding', ['boring', 'hard', 'tedious', 'fun'], 4);
    var questions = [q1, q2, q3];

    function score() {
        var sc = 0;
        return function (isCorrect) {
            if (isCorrect) {
                sc++;
            }
            return sc;
        }

    }
    var keepScore = score();

    function nextQuestion() {


        var n = Math.floor(Math.random() * questions.length);
        questions[n].displayQuestion();

        var answer = parseInt(prompt('Please select the correct answer.'));

        if (answer !== 'exit') {
            questions[n].checkAnswer(parseInt(answer), keepScore);

            nextQuestion();
        }

    }
    nextQuestion();
})();