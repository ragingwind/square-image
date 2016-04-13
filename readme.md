# square-image [![Build Status](https://travis-ci.org/ragingwind/square-image.svg?branch=master)](https://travis-ci.org/ragingwind/square-image)

> Resize an image in square size by a simple way


## Install

```
$ npm install --save square-image
```


## Usage

```js
const square = require('square-image');

// with simple size
square('./fixtures/logo.png', './images', 32).then(images => {});

// with simple sizes
square('./fixtures/logo.png', './images', [32, 64]).then(images => {});

// with various options
square('./fixtures/logo.png', './images', {
	128: 'icon-128x128.png',
	144: 'ms-touch-icon-144x144-precomposed.png',
	152: (filename, ext, size) => `chrome-splashscreen-icon-${size}x${size}${ext}`,
	192: (filename, ext, size, index) => manifest[index]
}).then(images => {});

// compatibility with `icons` member in manifest.json. square would find out `src` member in each property items
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
	}
}).then(images => {});

// call in synchronize
square.sync('./fixtures/logo.png', './images', 32, images => {});
```


## API

### square(src, [dest], sizes)

Square size of source image in providing sizes and returns the list of resized images as same format with manifest.json of Web Manifest

#### src

Type: `string`

Source path of the target image

#### dest

Type: `string`

Path for writing resized images. It will resolved with current running path

#### sizes

Type: `number`, or `array`, or `object`

Options for the target image in renaming and resizing. It can be a simple number and numbers in array, or object including detail options, which has a size as a key and can be have specific name and callback function for resized image. the callback function will give the filename, extension, size, and index of the size.

```js
var sizes = {
	128: 'specific-filename.png',
	128: 'icon-128x128.png',
	144: 'ms-touch-icon-144x144-precomposed.png',
	152: (filename, ext, size) => `chrome-splashscreen-icon-${size}x${size}${ext}`,
	192: (filename, ext, size, index) => resizedImages[index]
}
```

or also support [icons members of Web Manifest ](https://www.w3.org/TR/appmanifest/#icons-member) format. value of `src` will be a output filename.

```js
var sizes = {
	72: {
		src: 'icon-72x72.png',
		sizes: '72x72',
		type: 'image/png'
	},
	96: {
		src: 'icon-96x96.png'
		sizes: '96x96',
		type: 'image/png'
	},
	128: {
		src: 'icon-128x128.png',
		sizes: '128x128',
		type: 'image/png'
	},
	144: {
		src: 'ms-touch-icon-144x144-precomposed.png',
		sizes: '144x144',
		type: 'image/png'
	},
	152: {
		src: 'apple-touch-icon-152x152.png',
		sizes: '152x152',
		type: 'image/png'
	},
	192: {
		src: 'chrome-touch-icon-192x192.png',
		sizes: '192x192',
		type: 'image/png'
	}
};
```

### square.sync(src, [dest], sizes, cb(err, tasks))

Callback version of square

## License

MIT © [ragingwind](http://ragingwind.me)
