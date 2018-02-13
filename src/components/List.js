import React,{Component} from 'react';
import Card from './Card';
import {DropTarget} from 'react-dnd';

const listTargetSpec = {
    hover(props, monitor) {
        const draggedId = monitor.getItem().id;
        props.cardCallbacks.updateCardStatus(draggedId, props.id);
    }
}
let collect = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget()
    }
}

class List extends Component {
    render() {
        const { connectDropTarget } = this.props;
        return connectDropTarget(
            <div className="list">
                <h1>{this.props.title}</h1>
                {this.props.cards.map((card)=> {
                    return <Card key={card.id} id={card.id} title={card.title} description={card.description} color={card.color}
                        tasks={card.tasks} taskCallbacks={this.props.taskCallbacks} cardCallbacks={this.props.cardCallbacks}
                    />
                })}
            </div>
        )
    }
}

// export default List;
export default DropTarget("card", listTargetSpec, collect)(List);
