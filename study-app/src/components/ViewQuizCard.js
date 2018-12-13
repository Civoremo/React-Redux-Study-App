import React from 'react';
import { connect } from 'react-redux';
import { deleteQuiz } from '../actions';
import axios from 'axios';
import '../styles/ViewQuizCard.css';

import QuestionsList from './QuestionsList';
import EditQuiz from './EditQuiz';

const baseUrl = 'https://lambda-study-app.herokuapp.com/';

class ViewQuizCard extends React.Component {
    constructor() {
        super();
        this.state = {
            quiz: {},
            author: {},
            authorImg: '',
            displayModal: false,
            displayEditForm: false,
        }
    }

    componentDidMount() {
        this.getQuiz();

    }

    getQuiz = () => {
        axios
            .get(`${baseUrl}api/quizzes/${this.props.match.params.quizId}`)
            .then(res => {
                console.log(res);
                this.setState({
                    quiz: res.data,
                    author: res.data.author,
                    authorImg: res.data.author.img_url,
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    deleteQuiz = e => {
        e.preventDefault();
        const token = localStorage.getItem('userToken');
        this.props.deleteQuiz(this.props.match.params.quizId, token);
        this.props.history.push('/');
    }

    deleteModal = e => {
        e.preventDefault();
        this.setState({
            displayModal: !this.state.displayModal,
        });
    }

    editQuizForm = e => {
        e.preventDefault();
        this.setState({
            displayEditForm: !this.state.displayEditForm,
        });
    }

    render () {
        if(this.state.quiz.length === 0) {
            return <></>
        }
        console.log(this.state.author.img_url);
        return (
            <div className='viewQuiz-container'>
                <div>
                    <div className='quiz-info-container'>
                        <div className='quiz-delete-btn'>
                            <span className='entireQuiz-editQuizBtn' onClick={this.editQuizForm}>{this.state.displayEditForm ? 'cancel edit' :'edit quiz'}</span>
                            <span className='entireQuiz-editQuestionsBtn'>edit questions</span>
                            <span className='entireQuiz-deleteBtn' onClick={this.deleteModal}>delete quiz</span>
                            <div className={this.state.displayModal ? 'deleteModal' : 'hideModal'}>
                                <div className='deleteModal-content'>
                                    <h3 className='deleteModal-text'>Do you really wish to delete this Quiz?</h3>
                                    <div className='deleteModal-btn-container'>
                                        <button className='deleteModal-btn red' onClick={this.deleteQuiz}>Delete</button>
                                        <button className='deleteModal-btn blue' onClick={this.deleteModal}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='quiz-author-info-container'>
                            <div>
                                <img src={this.state.authorImg === null ? "https://bit.ly/2C9tLJe" : `${this.state.authorImg}`} alt="profile" className='quiz-profile-image'/>
                            </div>
                            <div>
                                <div className='quizView-info'>Title: <span className='quizView-text'>{this.state.quiz.title}</span></div>
                                <div className='quizView-info'>Topic: <span className='quizView-text'>{this.state.quiz.topic}</span></div>
                                <div className='quizView-info'>Author: <span className='quizView-text'>{this.state.author.username}</span></div>
                                <div className='quizView-info'>Votes: <span className='quizView-text'>{this.state.quiz.votes}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className={this.state.displayEditForm ? 'editQuizForm' : 'showEditQuizForm'}>
                        <EditQuiz quizId={this.props.match.params.quizId} />
                    </div>
                    <div className='questionsListForm'>
                        <QuestionsList quizId={this.props.match.params.quizId}/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        fetchQuiz: state.fetchQuiz,
        deleteQuiz: state.deleteQuiz,
    };
}

export default connect(
    mapStateToProps,
    { deleteQuiz }
)(ViewQuizCard);