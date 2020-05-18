import React, { useState } from 'react';
import Popup from '../Popup/Popup';

export default function Task({ task, board, deleteTask }) {
	const [ taskInfo, setTaskInfo ] = useState(false);

	return (
		<React.Fragment>
			{taskInfo && (
				<Popup
					task={task}
					taskInfo={taskInfo}
					setTaskInfo={setTaskInfo}
					board={board}
				/>
			)}
			<li className="Task__li">
				<div
					className="Task__li__name"
					onClick={() => setTaskInfo(true)}
				>
					<p>{task.name}</p>
				</div>
				<div className="Task__li__divider" />
				<button onClick={(e) => deleteTask(board.id, task.id, e)}>
					Remove
				</button>
			</li>
		</React.Fragment>
	);
}
