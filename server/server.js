const express = require('express');
const app = express();

const uuid = require('uuid').v4;
// const http = require('http').createServer(app);

const port = require('./config.sample.json').port || 9999;
const Boards = require('./database/BigBrain/handleBoard');

// app.use(express.json());

app.use((req, res, next) => {
	// Kollar att Content-Type är JSON
	if (req.is('json')) {
		let data = '';
		req.on('data', (chunk) => {
			data += chunk.toString();
		});
		//Parsar det
		req.on('end', () => {
			try {
				data = JSON.parse(data);
				req.body = data;
				next();
			} catch (e) {
				res.status(400).end();
			}
		});
	} else {
		next();
	}
});

app.use((req, res, next) => {
	let before = Date.now();
	res.once('finish', () => {
		let after = Date.now();
		console.log(
			res.statusCode,
			req.method,
			req.path,
			after - before + 'ms'
		);
	});
	next();
});

app.get('/boards', (req, res) => {
	res.status(200).json(Boards.getBoards());
});

app.get('/board/:id/tasks', (req, res) => {
	const id = req.params.id;
	const tasks = Boards.getTasks(id);
	res.status(200).send(tasks);
});

app.post('/create', (req, res) => {
	const type = req.query.type;

	switch (type) {
		case 'board':
			const board = {
				name: req.body.boardname,
				id: uuid(),
				tasks: []
			};

			Boards.save(board, res);

			res.status(201).json(board);

			break;

		default:
			res.status(400).send('incorrect querystring');
	}
});

app.post('/board/:id', (req, res) => {
	const id = req.params.id;

	let today = new Date();
	let date =
		today.getFullYear() +
		'-' +
		(today.getMonth() + 1) +
		'-' +
		today.getDate();

	let time =
		today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

	let now = date + ' ' + time;

	const task = {
		name: 'New task',
		description: '',
		created: now,
		id: uuid()
	};

	Boards.saveTasks(id, task, res);
	res.status(201).send(task);
});

app.delete('/board/:id', async (req, res) => {
	const id = req.params.id;

	try {
		Boards.deleteBoard(id, res);
		res.status(204).end();
	} catch (error) {
		res.status(500).end();
	}
});

app.delete('/board/:boardID/task/:taskID', (req, res) => {
	const boardID = req.params.boardID;
	const taskID = req.params.taskID;

	Boards.deleteTask(boardID, taskID, res);
});

app.patch('/board/:boardId/task/:taskId', (req, res) => {
	const fromBoardId = req.params.boardId;
	const toBoardId = req.body.board;
	const taskId = req.params.taskId;
	const task = req.body.task;

	// console.log('IDET PÅ BOARDEN TASKET ÄR PÅ', req.params.boardId);
	// console.log('IDET PÅ TASKET', req.params.taskId);
	// console.log('Detta är tasket', req.body.task);
	// console.log('Detta är idet på borden man ska posta till', req.body.board);

	Boards.moveTask(fromBoardId, toBoardId, task, res);
	res.status(200).send(task);
});

app.put('/board/:boardID/task/:taskID', (req, res) => {
	const boardID = req.params.boardID;
	const taskID = req.params.taskID;
	const task = req.body;

	Boards.updateTask(task, taskID, boardID, res);
	res.status(200).end();
});

app.listen(port, () => {
	console.log(`Server started on Localhost:${port}`);
});
