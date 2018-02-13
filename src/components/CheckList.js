import React,{Component} from 'react';

class CheckList extends Component {
    checkInputKeyPress(evt){
        if(evt.key === 'Enter') {
            this.props.taskCallbacks.add(this.props.cardId, evt.target.value);
            evt.target.value = '';
        }
    }

    render() {
        return (
            <div className="checklist">
                <ul >
                    {this.props.tasks.map((task, taskIndex)=>{
                        return (
                            <li key={task.id} className="checklist__task">
                                <input type="checkbox" checked={task.done}
                                    onChange={this.props.taskCallbacks.toggle.bind(null, this.props.cardId, task.id, taskIndex)}
                                />
                                {task.name}{" "}
                                <span className="checklist__task--remove"
                                    onClick={this.props.taskCallbacks.delete.bind(null, this.props.cardId, task.id, taskIndex)}
                                />
                            </li>
                        )
                    })}
                </ul>
                <input type="text" className="checklist__task--add-task" placeholder="type then hit Enter to add a task"
                    onKeyPress={this.checkInputKeyPress.bind(this)}
                />
            </div>
        )
    }
}

export default CheckList;
