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

// call in synchronize
square.sync('./fixtures/logo.png', './images', 32, images => {});
```


## API

### square(src, [dest], sizes)

#### src

Type: `string`

Source path of the target image

#### dest

Type: `string`

Path for writing resized images. It will resolved with current running path

#### sizes

Type: `number`, or `array`, or `object`

Options for the target image in renaming and resizing. It can be simple number and numbers in array, or object including detail options, which has a size as a key and can be have specific name and callback function for resized image. the callback function will give the filename, extension, size, and index of the size.

```js
var sizes = {
	128: 'specific-filename.png',
	128: 'icon-128x128.png',
	144: 'ms-touch-icon-144x144-precomposed.png',
	152: (filename, ext, size) => `chrome-splashscreen-icon-${size}x${size}${ext}`,
	192: (filename, ext, size, index) => resizedImages[index]
}
```

### square.sync(src, [dest], sizes, cb(err, tasks))

Callback version of square

## License

MIT © [ragingwind](http://ragingwind.me)
