import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Task from '../Task/Task';

const Board = ({ board, deleteBoard }) => {
	const [ tasks, setTasks ] = useState([]);

	useEffect(
		() => {
			axios
				.get(`/board/${board.id}/tasks`)
				.then((response) => {
					setTasks(response.data);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		[ board ]
	);

	const postTask = (e) => {
		e.preventDefault();
		axios
			.post(`/board/${board.id}`)
			.then((response) => {
				setTasks([ ...tasks, response.data ]);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const deleteTask = (boardID, taskID, e) => {
		e.preventDefault();
		axios
			.delete(`/board/${boardID}/task/${taskID}`)
			.then((response) => {
				console.log(response);
				setTasks(tasks.filter((task) => task.id !== taskID));
			})
			.catch((error) => {
				console.log(error);
			});
	};
	return (
		<div className="Board">
			<p> {board.name} </p>
			<p> {board.id} </p>

			<ul className="Board__ul__tasks">
				{tasks.map((task) => (
					<Task
						key={task.created}
						task={task}
						board={board}
						deleteTask={deleteTask}
					/>
				))}
			</ul>

			<div className="Board__buttons">
				<button onClick={postTask}>New Task</button>
				<button
					onClick={(e) => {
						deleteBoard(board.id, e);
					}}
				>
					Delete Board
				</button>
			</div>
		</div>
	);
};

export default Board;
