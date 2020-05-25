const { boards, save } = require('./brain');

exports.getBoards = () => {
	return boards.entries;
};

exports.getTasks = (id) => {
	const board = boards.entries.find((board) => board.id === id);

	return board.tasks;
};

exports.save = (board, res) => {
	const exists = boards.entries.find(({ name }) => name === board.name);

	if (exists) {
		console.log('Board already exists');
		res.status(406).end();
	} else {
		boards.entries.push(board);
		save(boards)
			.then(() => {
				res.status(201).end();
			})
			.catch((error) => {
				console.log(error);
				res.status(500).end();
			});
	}
};

exports.saveTasks = (id, task, res) => {
	const idx = boards.entries.findIndex((board) => board.id === id);

	if (idx !== -1) {
		boards.entries[idx].tasks.push(task);
		save(boards)
			.then(() => {
				res.status(200).end();
			})
			.catch((error) => {
				console.log(error);
				res.status(500).end();
			});
	}
};

exports.updateTask = (task, taskID, boardID, res) => {
	const boardIndex = boards.entries.findIndex(
		(board) => board.id === boardID
	);

	if (boardIndex === -1) {
		res.status(400).end();
	}

	const taskIndex = boards.entries[boardIndex].tasks.findIndex(
		(task) => task.id === taskID
	);

	if (taskIndex === -1) {
		res.status(400).end();
	}

	boards.entries[boardIndex].tasks[taskIndex] = task;
	save(boards)
		.then(() => {
			res.status(200).end();
		})
		.catch((error) => {
			console.log(error);
			res.status(500).end();
		});
};

exports.deleteBoard = (id, res) => {
	const boardIndex = boards.entries.findIndex((board) => board.id === id);

	if (boardIndex !== -1) {
		boards.entries.splice(boardIndex, 1);
		save(boards)
			.then(() => {
				res.status(200).end();
			})
			.catch((error) => {
				console.log(error);
				res.status(500).end();
			});
	} else {
		console.log('Already gone!');
	}
};

exports.deleteTask = (boardID, taskID, res) => {
	const boardIndex = boards.entries.findIndex(
		(board) => board.id === boardID
	);

	if (boardIndex === -1) {
		res.status(400).end();
	}

	const taskIndex = boards.entries[boardIndex].tasks.findIndex(
		(task) => task.id === taskID
	);

	if (taskIndex === -1) {
		res.status(400).end();
	}

	boards.entries[boardIndex].tasks.splice(taskIndex, 1);
	save(boards)
		.then(() => {
			res.status(204).end();
		})
		.catch((error) => {
			console.log(error);
			res.status(500).end();
		});
};

exports.moveTask = (fromBoardId, toBoardId, task, res) => {
	const fromBoardIndex = boards.entries.findIndex(
		(fromBoard) => fromBoard.id === fromBoardId
	);

	if (fromBoardIndex === -1) {
		res.status(400).end();
	}

	const taskIndex = boards.entries[fromBoardIndex].tasks.findIndex(
		(item) => item.id === task.id
	);

	if (taskIndex === -1) {
		res.status(400).end();
	}

	const toBoardIndex = boards.entries.findIndex(
		(toBoard) => toBoard.id === toBoardId
	);
};
