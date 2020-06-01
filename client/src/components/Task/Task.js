import React, { useState } from 'react';
import Popup from '../Popup/Popup';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../../utilities/util';

export default function Task({ task, board, deleteTask, refresh }) {
	const [ taskInfo, setTaskInfo ] = useState(false);

	const [ { isDragging }, dragRef ] = useDrag({
		item: {
			type: ItemTypes.TASK,
			task,
			board
			// name: task.name,
			// description: task.description,
			// id: task.id,
			// created: task.created
		},
		collect: (monitor) => ({
			isDragging: monitor.isDragging()
		})
	});

	return (
		<React.Fragment>
			{taskInfo && (
				<Popup
					task={task}
					taskInfo={taskInfo}
					setTaskInfo={setTaskInfo}
					board={board}
					refresh={refresh}
				/>
			)}
			<li
				className="Task__li"
				ref={dragRef}
				style={{ opacity: isDragging ? 0.2 : 1 }}
			>
				<div className="Task__li__wrapper">
					<div
						className="Task__li__wrapper__name"
						onClick={() => setTaskInfo(true)}
					>
						<p>{task.name}</p>
					</div>
				</div>
				<div className="Task__li__divider" />
				<button
					className="Task__li__button"
					onClick={(e) => deleteTask(board.id, task.id, e)}
				>
					Remove
				</button>
			</li>
		</React.Fragment>
	);
}
