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
	size = Math.floor(size);
	return (dimensions.height === size) && (dimensions.width === size);
};

test.cb.before(t => {
	rm(dest, () => md(dest, t.end));
});

test.serial('square to a image', t => {
	return square(src, dest, 32).then(images => {
		Object.keys(images).forEach(size => t.ok(verifyImage(images[size].src, size)));
	});
});

test.serial('square to multiple images', t => {
	return square(src, dest, [64, 92]).then(images => {
		Object.keys(images).forEach(size => t.ok(verifyImage(images[size].src, size)));
	});
});

test.serial('square to multiple images in various options', t => {
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
		Object.keys(images).forEach(size => t.ok(verifyImage(images[size].src, size)));
	});
});

test.serial('square to multiple images in synchronize', t => {
	return square.sync(src, dest, [384, 512], (err, images) => {
		if (err) {
			t.fail(err);
			return;
		}

		Object.keys(images).forEach(size => t.ok(verifyImage(images[size].src, size)));
	});
});

test.serial('square to multiple images as icons member of manifest', t => {
	return square(src, dest, {
		72: {
			src: 'icon-72x72.png',
			sizes: '72x72',
			type: 'image/png'
		},
		96: {
			src: 'icon-96x96.png'
		},
		128: {
			src: 'icon-128x128.png'
		},
		144: {
			src: 'ms-touch-icon-144x144-precomposed.png'
		},
		152: {
			src: 'apple-touch-icon-152x152.png'
		},
		192: {
			src: 'chrome-touch-icon-192x192.png'
		},
		384: {
			src: 'chrome-splashscreen-icon-384x384.png'
		},
		512: {
			src: 'icon-512x512.png'
		}
	}).then(images => {
		Object.keys(images).forEach(size => t.ok(verifyImage(images[size].src, size)));
	});
});

test.serial('square returns icons member field like manifest', t => {
	return square(src, dest, [32, 64]).then(images => {
		Object.keys(images).forEach(size => {
			t.is(images[size].src, `grey-chrome-${size}x${size}.png`);
			t.is(images[size].sizes, `${size}x${size}`);
			t.is(images[size].type, 'image/png');
		});
	});
});
