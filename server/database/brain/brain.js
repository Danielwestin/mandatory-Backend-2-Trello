const fs = require('fs');

exports.boards = {
	entries: require('../store/board.json'),
	path: './database/store/board.json'
};

exports.save = ({ entries, path }) => {
	fs.writeFile(path, JSON.stringify(entries), (error) => {
		if (error) {
			console.log(error, 'eroor in fs');
		}
	});
};
