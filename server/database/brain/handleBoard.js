const { boards, save } = require('./brain');

exports.getBoards = () => {
	return boards.entries;
};

exports.save = (board, res) => {
	const exists = boards.entries.find(({ name }) => name === board.name);

	if (exists) {
		console.log('Board already exists');
		res.status(406).end();
	} else {
		boards.entries.push(board);
		save(boards);
	}
};

exports.saveTasks = (id, task) => {
	const idx = boards.entries.findIndex((board) => board.id === id);

	if (idx !== -1) {
		boards.entries[idx].tasks.push(task);
		save(boards);
	}
};

exports.getTasks = (id) => {
	const board = boards.entries.find((board) => board.id === id);

	return board.tasks;
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
	save(boards);
};

exports.deleteBoard = (id) => {
	const boardIndex = boards.entries.findIndex((board) => board.id === id);

	if (boardIndex !== -1) {
		boards.entries.splice(boardIndex, 1);
		save(boards);
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
	save(boards);
	res.status(200).end();
};
