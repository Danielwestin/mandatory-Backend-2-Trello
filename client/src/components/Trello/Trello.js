import React, { useEffect, useState } from 'react';
import Board from '../Board/Board';
import axios from 'axios';

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

	const set = (e) => {
		setBoardname(e.target.value);
	};

	const send = (e) => {
		e.preventDefault();
		axios
			.post('/create?type=board')
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
		setBoardname('');
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
			<header className="Trello__header">
				<h2>Trello</h2>
				<form onSubmit={submit}>
					<input
						type="text"
						placeholder="Boardname"
						value={boardname}
						onChange={set}
					/>
					<button type="submit">Create</button>
				</form>
				<button onClick={send}>Click</button>
			</header>
			<main className="Trello__main">
				{boards.map((board, i) => (
					<Board key={i} board={board} deleteBoard={deleteBoard} />
				))}
			</main>
		</React.Fragment>
	);
}
