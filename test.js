import test from 'ava';
import rm from 'rmdir';
import md from 'mkdirp';
import path from 'path';
import sizeof from 'image-size';
import square from './';

const dest = '.tmp';
const src = './fixtures/grey-chrome.png';
const verifyImage = (image, size) => {
	var dimensions = sizeof(path.join(dest, image));
	return (dimensions.height === size) && (dimensions.width === size);
};

test.cb.before(t => {
	rm(dest, () => md(dest, t.end));
});

test('square to a image', t => {
	return square(src, dest, 32).then(images => {
		images.forEach(image => t.ok(verifyImage(image.name, image.size)));
	});
});

test('square to multiple images', t => {
	return square(src, dest, [64, 92]).then(images => {
		images.forEach(image => t.ok(verifyImage(image.name, image.size)));
	});
});

test('square to multiple images in various options', t => {
	var resizedImages = [
		'icon-128x128.png',
		'ms-touch-icon-144x144-precomposed.png',
		'chrome-splashscreen-icon-152x152.png',
		'chrome-touch-icon-192x192.png'
	];

	return square(src, dest, {
		128: 'icon-128x128.png',
		144: 'ms-touch-icon-144x144-precomposed.png',
		152: (filename, ext, size) => `chrome-splashscreen-icon-${size}x${size}${ext}`,
		192: (filename, ext, size, index) => resizedImages[index]
	}).then(images => {
		images.forEach(image => t.ok(verifyImage(image.name, image.size)));
	});
});

test('square to multiple images in synchronize', t => {
	return square.sync(src, dest, [384, 512], (err, images) => {
		if (err) {
			t.fail(err);
			return;
		}

		images.forEach(image => t.ok(verifyImage(image.name, image.size)));
	});
});
