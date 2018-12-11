import axios from 'axios';

export const FETCHING_START = 'FETCHING_START';
export const FETCHING_SUCCESS = 'FETCHING_SUCCESS';
export const FETCHING_FAILURE = 'FETCHING_FAILURE';

export const ADD_QUIZ_START = 'ADD_QUIZ_START';
export const ADD_QUIZ_SUCCESS = 'ADD_QUIZ_SUCCESS';
export const ADD_QUIZ_FAILURE = 'ADD_QUIZ-FAILURE';

export const DELETE_QUIZ_START = 'DELETE_QUIZ_START';
export const DELETE_QUIZ_SUCCESS ='DELETE_QUIZ_SUCCESS';
export const DELETE_QUIZ_FAILURE = 'DELETE_QUIZ_FAILURE';


const baseUrl = 'https://lambda-study-app.herokuapp.com/';

export const fetchQuizzes = () => dispatch => {
    dispatch({ type: FETCHING_START });
    axios
        .get(`${baseUrl}api/quizzes`)
        .then(res => {
            console.log(res);
            dispatch({ type: FETCHING_SUCCESS, payload: res.data });
        })
        .catch(err => {
            // console.log(err);
            dispatch({ type: FETCHING_FAILURE, payload: err });
        });
};

export const deleteQuiz = (quizId, token) => dispatch => {
    dispatch({ type: DELETE_QUIZ_START });
    axios({
            method: 'delete',
            url: `${baseUrl}api/quizzes/${quizId}`,

            headers: {
                Authorization: token
            }
        })
        .then(res => {
            console.log(res);
            dispatch({ type: DELETE_QUIZ_SUCCESS });
        })
        .catch(err => {
            dispatch({ type: DELETE_QUIZ_FAILURE, payload: err});
        });
};

export const addNewQuiz = (quizTitle, quizTopic, token) => dispatch => {
    dispatch({ type: ADD_QUIZ_START });
    axios({
            method: 'post',
            url: `${baseUrl}api/quizzes`,
            data: {
                title: quizTitle,
                topic: quizTopic
            },
            headers: {
                Authorization: token
            }
        })
        .then(res => {
            dispatch({ type: ADD_QUIZ_SUCCESS });
        })
        .catch(err => {
            dispatch({ type: ADD_QUIZ_FAILURE, payload: err });
        });
};