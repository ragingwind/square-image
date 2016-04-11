'use strict';

const jimp = require('jimp');
const eachAsync = require('each-async');
const path = require('path');

const is = {
	array: v => typeof v === 'object' && v instanceof Array,
	object: v => typeof v === 'object',
	string: v => v && typeof v === 'string',
	number: v => v && typeof v === 'number',
	func: v => v && typeof v === 'function'
};

function prepareSquareTask(src, sizes) {
	let tasks = [];
	const ext = path.extname(src);
	const base = path.basename(src, ext);
	const tasked = (size, name) => {
		tasks.push({
			size: size,
			name: name || `${base}-${size}x${size}${ext}`
		});
	};

	if (is.number(sizes)) {
		tasked(sizes);
	} else if (is.array(sizes)) {
		sizes.forEach(s => tasked(s));
	} else if (is.object(sizes)) {
		Object.keys(sizes).forEach(s => {
			if (is.string(sizes[s])) {
				tasked(Number(s), sizes[s]);
			} else if (is.func(sizes[s])) {
				tasked(Number(s), sizes[s](base, ext, s));
			} else {
				throw new Error('Unknown type for target images');
			}
		});
	}

	return tasks;
}

function square(src, dest, sizes, cb) {
	if (!src) {
		throw new Error('Source image should be provided');
	}

	if (is.number(dest) || is.array(dest) || is.object(dest)) {
		sizes = dest;
		dest = path.resolve(process.cwd(), path.dirname(src));
	}

	jimp.read(src, function (err, image) {
		let tasks = prepareSquareTask(src, sizes);

		if (err) {
			cb(err);
			return;
		}

		eachAsync(tasks, (task, index, done) => {
			image.resize(task.size, task.size).write(path.join(dest, task.name), done);
		}, () => {
			cb(null, tasks);
		});
	});
}

module.exports = function (src, dest, sizes) {
	return new Promise((resolve, reject) => {
		square(src, dest, sizes, (err, tasks) => {
			if (err) {
				reject(err);
			} else {
				resolve(tasks);
			}
		});
	});
};

module.exports.sync = square;
