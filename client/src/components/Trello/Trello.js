import React, { useEffect, useState } from 'react';
import Board from '../Board/Board';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Trello() {
	const [ boardname, setBoardname ] = useState('');
	const [ boards, setBoards ] = useState([]);
	useEffect(() => {
		axios
			.get('/boards')
			.then((response) => {
				setBoards(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const refreshBoards = () => {
		axios
			.get('/boards')
			.then((response) => {
				setBoards(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const set = (e) => {
		setBoardname(e.target.value);
	};

	const submit = (e) => {
		e.preventDefault();
		axios
			.post('/create?type=board', { boardname })
			.then((response) => {
				console.log(response.data);
				setBoards([ ...boards, response.data ]);
			})
			.catch((error) => {
				console.log(error);
			});
		setBoardname('');
	};

	const deleteBoard = (id, e) => {
		e.preventDefault();
		axios
			.delete(`/board/${id}`)
			.then((response) => {
				console.log(response);
				setBoards(boards.filter((board) => board.id !== id));
			})
			.catch((error) => {
				console.log('hello');

				console.log(error);
			});
	};

	return (
		<React.Fragment>
			<DndProvider backend={HTML5Backend}>
				<header className="Trello__header">
					<h2>Trello</h2>
					<div className="Trello__header__form">
						<form onSubmit={submit}>
							<input
								type="text"
								placeholder="Enter a name for your board"
								value={boardname}
								onChange={set}
							/>
							<button type="submit">Create</button>
						</form>
					</div>
				</header>
				<main className="Trello__main">
					{boards.map((board, i) => (
						<Board
							refreshBoards={refreshBoards}
							key={i}
							board={board}
							deleteBoard={deleteBoard}
						/>
					))}
				</main>
			</DndProvider>
		</React.Fragment>
	);
}
