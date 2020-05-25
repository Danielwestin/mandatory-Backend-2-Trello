import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Task from '../Task/Task';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../utilities/util';

const Board = ({ board, deleteBoard }) => {
	const [ tasks, setTasks ] = useState([]);

	const [ { isOver }, dropRef ] = useDrop({
		accept: ItemTypes.TASK,
		drop: (item, monitor) => moveTask(item.task, item.board.id, board.id),
		collect: (monitor) => ({
			isOver: !!monitor.isOver()
		})
	});

	const moveTask = (task, fromBoard, toBoard) => {
		axios
			.patch(`/board/${fromBoard}/task/${task.id}`, {
				task,
				board: toBoard
			})
			.then((response) => {
				console.log(response);
			});
		// const item = tasks.filter((task, id) => task.id !== id);

		// setTasks(tasks.filter((task, id) => task.id !== id).concat(item));
	};

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
			<p>Name: {board.name} </p>
			<p>Board ID: {board.id} </p>

			<ul
				className="Board__ul__tasks"
				ref={dropRef}
				style={{ backgroundColor: isOver && 'yellow' }}
			>
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
				<button className="Board__buttons__newTask" onClick={postTask}>
					New Task
				</button>
				<button
					className="Board__buttons__deleteTask"
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
