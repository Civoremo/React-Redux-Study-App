import React from 'react';
import { connect } from 'react-redux';
import { fetchQuestions } from '../actions';
import axios from 'axios';

import '../styles/QuestionsList.css';

class QuestionsList extends React.Component {
    constructor() {
        super();
        this.state = {
            questionIndex: 0,
            radioPick: null,
            savedAnswers: [],
            fetched: false,
            quizScore: 0,
            finalScore: null,
            quizStarted: false,
            quizFinished: false,
            answerPicked: false,
        }
    }

    componentDidMount() {
        const id = this.props.quizId;
        this.props.fetchQuestions(id);
    }

    nextQuestion = e => {
        if(this.state.questionIndex < this.props.questions.length - 1) {
            this.setState({
                questionIndex: this.state.questionIndex +1,
                answerPicked: false,
            });
        }
        else if (this.state.questionIndex === this.props.questions.length - 1) {
            this.setState({
                quizFinished: true,
                answerPicked: false,
            });
        }
    }

    pickedAnswer = id => {
        this.setState({
            radioPick: id
        });
        
    }

    savePick = e => {
        e.preventDefault();
        if(this.state.radioPick === null) {
            this.setState({
                answerPicked: true,
            });
            this.finalQuizScore();
            return <></>
        } 
        else {
            axios({
                    method: 'get',
                    url: `https://lambda-study-app.herokuapp.com/api/quizzes/${this.props.quizId}/questions/${this.props.questions[this.state.questionIndex].id}/response`,
                    
                    params: {
                        option: this.state.radioPick +1,
                    }
                })
                .then(res => {
                    if(res.data.correct === true) {
                        console.log(res.data.correct)
                        this.setState({
                            quizScore: this.state.quizScore +1,
                            radioPick: null,
                            answerPicked: false,
                        });
                        this.finalQuizScore();
                    }
                    else {
                        console.log(res.data.correct)
                        this.setState({
                            radioPick: null,
                            answerPicked: false,
                        });
                        this.finalQuizScore();
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
        setTimeout(() => this.nextQuestion(), 200);
        
    }

    finalQuizScore = () => {
        const tempScore = (parseInt((this.state.quizScore) / parseInt(this.props.questions.length) * 100).toFixed(2));
        console.log(tempScore);
        
        switch (true) {
            case (tempScore < 59):
                this.setState({
                    finalScore: 'F',
                });
            break;
            case (60 <= tempScore <= 63):
                this.setState({
                    finalScore: 'D-',
                });
            break;
            case (64 <= tempScore <= 67):
                this.setState({
                    finalScore: 'D',
                });
            break;
            case (68 <= tempScore <= 69):
                this.setState({
                    finalScore: 'D+',
                });
            break;
            case (70 <= tempScore <= 73):
                this.setState({
                    finalScore: 'C-',
                });
            break;
            case (74 <= tempScore <= 77):
                this.setState({
                    finalScore: 'C',
                });
            break;
            case (78 <= tempScore <= 79):
                this.setState({
                    finalScore: 'C+',
                });
            break;
            case (80 <= tempScore <= 83):
                this.setState({
                    finalScore: 'B-',
                });
            break;
            case (84 <= tempScore <= 87):
                this.setState({
                    finalScore: 'B',
                });
            break;
            case (88 <= tempScore <= 89):
                this.setState({
                    finalScore: 'B+',
                });
            break;
            case (90 <= tempScore <= 93):
                this.setState({
                    finalScore: 'A-',
                });
            break;
            case (94 <= tempScore <= 97):
                this.setState({
                    finalScore: 'A',
                });
            break;
            case (98 <= tempScore <= 100):
                this.setState({
                    finalScore: 'A+',
                });
            break;
            default:
            break;
        }
    }

    startingQuiz = e => {
        e.preventDefault();
        this.setState({
            quizStarted: !this.state.quizStarted
        });
    }

    tryAgainQuiz = e => {
        e.preventDefault();
        window.location.reload();
    }


    render () {
        if(this.props.questions.length === 0) {
            return <div></div>
        }
        console.log(this.state.finalScore);
        console.log(this.state.quizScore);
        return (
            <div>
                <div className={this.state.quizStarted ? 'question-container' : 'startQuiz'}>
                    <span className='question-title'>{this.props.questions[this.state.questionIndex].question}</span>
                    <div className='allAnswer-container'>
                        {this.props.questions[this.state.questionIndex].options.map((answer, index) => {
                            return (
                                <div key={index} className='answer-content'>
                                <div className='radioBtn-container'>
                                    <input 
                                        type="radio"
                                        id={index}
                                        onChange={() => this.pickedAnswer(index)}
                                        checked={this.state.radioPick === index ? true : false}
                                        className='radio-btn'
                                    />
                                </div>
                                <div className='answerText-container'>
                                    <span className='answer-text'>{answer}</span>
                                </div>
                                </div>
                            );
                        })}
                    </div>
                    <button className='saveAnswer-btn' onClick={this.savePick}>Save Answer</button>
                    <div className={this.state.answerPicked ? 'missingAnswer' : 'finished'}>Select Answer!</div>
                </div>
                <div className={this.state.quizStarted ? 'startQuiz' : 'quiz-start-container'}>
                    <div>
                        <span className='quizStart-btn' onClick={this.startingQuiz}>START QUIZ</span>
                    </div>
                </div>
                <div className={this.state.quizFinished ? 'quiz-finished-container' : 'finished'}>
                    <div>
                        <div className='quizFinalScore-text'>Quiz Score: {this.state.finalScore}</div>
                    </div>
                    <div>
                        <div className='quizFinalTryAgain-btn' onClick={this.tryAgainQuiz}>Try Again</div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        questions: state.questions,
        fetchingQuestions: state.fetchingQuestions,
    };
}

export default connect(
    mapStateToProps,
    { fetchQuestions }
)(QuestionsList);