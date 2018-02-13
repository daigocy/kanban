import React, {Component} from 'react';
import KanbanBoard from './KanbanBoard';
import 'whatwg-fetch';
import 'babel-polyfill'
import update from 'react-addons-update'

import { throttle } from '../utils/utils';
import '../css/main.css'


const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type': 'application/json',
    Authorization: '15366013271'
};

class KanbanBoardContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: []
        };
        this.updateCardPosition = throttle(this.updateCardPosition.bind(this), 5000);
        this.updateCardStatus = throttle(this.updateCardStatus.bind(this),5000);
    }
    componentDidMount() {
        fetch(API_URL + '/cards', {headers: API_HEADERS})
        .then( (response) => response.json())
        .then( (responseData) => {
            this.setState({ cards: responseData });
        })
        .catch( (error) => {
            console.log('error fetching and parsing data', error);
        });
        console.log("reMount");
    }

    addTask(cardId, taskName) {
        let cardIndex = this.state.cards.findIndex((card)=>card.id===cardId);
        let newTask = {
            id: Date.now(), name: taskName, done:false
        }
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$push: [newTask]}
            }
        })
        this.setState({cards:nextState});
        fetch(`${API_URL}/cards/${cardId}/tasks`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(newTask)
        })
        .then((response) => response.json())
        .then((responseData) => {
            newTask.id = responseData.id;
            this.setState({cards: nextState});
        });
    }
    deleteTask(cardId, taskId, taskIndex) {
        let cardIndex = this.state.cards.findIndex((card)=>card.id===cardId);
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$splice: [[taskIndex, 1]]}
            }
        })
        this.setState({cards:nextState})
        // 调用fetch访问API
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`,{
            method: 'delete',
            headers: API_HEADERS
        })

    }
    toggleTask(cardId, taskId, taskIndex) {
        let cardIndex = this.state.cards.findIndex((card)=>card.id===cardId);
        let newDoneValue;
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {
                    [taskIndex]: {
                        done: {$apply: (done) => {
                            newDoneValue = !done;
                            return newDoneValue;
                        }}
                    }
                }
            }
        });
        this.setState({cards:nextState});
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify({done:newDoneValue})
        });
    }

    updateCardStatus(cardId, listId) {
        // console.log(`call updateCardStatus,drag card:${cardId} to ${listId}`);
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
        let card = this.state.cards[cardIndex]
        if (card.status !== listId) {
            this.setState(
                update(this.state, {
                    cards: {
                        [cardIndex]: {
                            status: {$set: listId}
                        }
                    }
                })
            );
        }
    }
    updateCardPosition(cardId, afterId) {
        // console.log(`darg ${cardId} over ${afterId}`);
        if (cardId !== afterId) {
            let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
            let card = this.state.cards[cardIndex];
            let afterIndex = this.state.cards.findIndex((card) => card.id === afterId);
            this.setState(update(this.state, {
                cards: {
                    $splice: [
                        [cardIndex, 1],
                        [afterIndex, 0, card]
                    ]
                }
            }));
        }
    }

    render() {
        return <KanbanBoard cards={this.state.cards}
            taskCallbacks={ {
                toggle: this.toggleTask.bind(this),
                delete: this.deleteTask.bind(this),
                add: this.addTask.bind(this)
            } }
            cardCallbacks={{
                updateCardStatus: this.updateCardStatus,
                updateCardPosition: this.updateCardPosition
            }}
        />
    }
}
export default KanbanBoardContainer;
