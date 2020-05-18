import React, { useState } from 'react';
import Popup from '../Popup/Popup';

export default function Task({ task, board }) {
	const [ taskInfo, setTaskInfo ] = useState(false);

	return (
		<React.Fragment>
			{taskInfo && (
				<Popup task={task} setTaskInfo={setTaskInfo} board={board} />
			)}
			<li className="Task__li" onClick={() => setTaskInfo(true)}>
				<p>{task.name}</p>
				<p>{task.created}</p>
			</li>
		</React.Fragment>
	);
}
