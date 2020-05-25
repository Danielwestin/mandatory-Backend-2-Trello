import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import FocusTrap from 'focus-trap-react';

export default function Popup({ task, taskInfo, setTaskInfo, board }) {
	const [ updateTask, setUpdateTask ] = useState({
		name: task.name,
		description: task.description,
		created: task.created,
		id: task.id
	});

	const set = (e) => {
		setUpdateTask({
			...updateTask,
			[e.target.name]: e.target.value
		});
	};

	const send = (e) => {
		e.preventDefault();

		if (updateTask.name.length > 1) {
			axios
				.put(`/board/${board.id}/task/${task.id}`, updateTask)
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
			setTaskInfo(false);
		}
	};
	return ReactDOM.createPortal(
		<FocusTrap active={taskInfo}>
			<div className="Popup__background">
				<div className="Popup">
					<div className="Popup__exit">
						<button onClick={() => setTaskInfo(false)}>Exit</button>
					</div>

					<form onSubmit={send}>
						<input
							type="text"
							placeholder={task.name}
							name="name"
							onChange={set}
							value={updateTask.name}
							autoFocus
						/>

						<textarea
							name="description"
							placeholder={task.description}
							onChange={set}
							value={updateTask.description}
							rows="10"
							cols="53"
						/>
						<button type="submit">Send</button>
					</form>

					<p>Created: {task.created}</p>
					<p>Task ID: {task.id}</p>
					<p>Board ID: {board.id}</p>
				</div>
			</div>
		</FocusTrap>,
		document.querySelector('body')
	);
}
