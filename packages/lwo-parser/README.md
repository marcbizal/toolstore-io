# lwo-parser

LWO parser is simple parser for Lightwave Object files originally intended to support models used in LEGO Rock Raiders (LRR). LWO parser does only one thing: parse binary LWO files. It does not do anything with the data other than constructing a much simpler to use JavaScript object.

## Installation
```bash
npm install --save @toolstore-io/lwo-parser
```

## Usage
LWO parser is written for Node.js using [Buffer](https://nodejs.org/api/buffer.html) but can easily be adapted to work for web by bundling it with webpack along with [feross/buffer](https://github.com/feross/buffer).

```javascript
// When bundling for web include Buffer in the global scope.
window.Buffer = require('buffer/').Buffer;
const lwo = require('lwo-parser');

// Retreive a buffer for a file ...

const object = lwo.parseBuffer(buffer);
```

## References

[LightWave 3D Object File Format](http://www.sandbox.de/osg/lightwave.htm)
