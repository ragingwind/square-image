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
	let tasks = {};
	const ext = path.extname(src);
	const base = path.basename(src, ext);
	const tasked = (size, name) => {
		size = Math.floor(size);
		tasks[size] = {
			src: name || `${base}-${size}x${size}${ext}`,
			sizes: `${size}x${size}`,
			type: `image/${ext.replace(/^./, '')}`
		};
	};

	if (is.number(sizes)) {
		tasked(sizes);
	} else if (is.array(sizes)) {
		sizes.forEach(s => tasked(s));
	} else if (is.object(sizes)) {
		Object.keys(sizes).forEach(s => {
			if (is.string(sizes[s])) {
				tasked(s, sizes[s]);
			} else if (is.func(sizes[s])) {
				tasked(s, sizes[s](base, ext, s));
			} else if (is.object(sizes[s])) {
				tasked(s, sizes[s].src);
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

		eachAsync(Object.keys(tasks), (size, index, done) => {
			size = Math.floor(size);
			image.resize(size, size).write(path.join(dest, tasks[size].src), done);
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
