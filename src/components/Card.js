import React,{Component} from 'react';
import CheckList from './CheckList';
import marked from 'marked';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {DragSource, DropTarget} from 'react-dnd';

const cardDragSpec = {
    beginDrag(props) {
        return {
            id: props.id
        }
    }
}

let collectDrag = (connect, monitor) => {
    return {connectDragSource: connect.dragSource()}
}

const cardDropSpec = {
    hover(props, monitor) {
        const draggedId = monitor.getItem().id;
        props.cardCallbacks.updateCardPosition(draggedId, props.id);
    }
}
let collectDrop = (connect, monior) => {
    return {connectDropTarget: connect.dropTarget()}
}


class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetails: false
        }
    }
    toggleDetails() {
        this.setState({ showDetails: !this.state.showDetails });
    }
    render() {
        let details;
        const { connectDragSource,connectDropTarget } = this.props;
        if(this.state.showDetails) {
            details = (
                <div className="card__details">
                    <span dangerouslySetInnerHTML={{__html: marked(this.props.description)}}/>
                    <CheckList cardId={this.props.id} tasks={this.props.tasks} taskCallbacks={this.props.taskCallbacks}/>
                </div>
            )
        };
        let sideColor = {
            position: 'absolute',
            zIndex: -1,
            top: 0,
            bottom: 0,
            left: 0,
            width: 7,
            backgroundColor: this.props.color
        };
        return connectDropTarget(connectDragSource(
            <div className="card">
                <div style={sideColor} />
                <div className={`card__title${this.state.showDetails?' card__open':''}`} onClick={this.toggleDetails.bind(this)}>{this.props.title}</div>
                <ReactCSSTransitionGroup transitionName="toggle"
                    transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                        {details}
                </ReactCSSTransitionGroup>
            </div>
        ))
    }
}

// export default Card;
// export default DragSource("card", cardDragSpec, collectDrag)(Card);
const DragCard = DragSource("card", cardDragSpec, collectDrag)(Card);
export default DropTarget("card" ,cardDropSpec, collectDrop)(DragCard);
