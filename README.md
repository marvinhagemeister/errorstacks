# errorstacks

Simple parser for Error stack traces.

Currently supported browsers/platforms:

- Firefox
- Chrome
- Edge
- Node

## Usage

Install `errorstacks` via your package manager of choice. Here we'll use `npm`.

```bash
npm install errorstacks
```

Example code:

```js
import { parseStackTrace } from 'errorstacks';

function foo() {
  throw new Error('fail');
}

try {
  foo();
} catch (err) {
  const parsed = parseStackTrace(err.stack);
  console.log(parsed);
  // Logs:
  // [
  //   {
  //     line: 4,
  //     column: 8,
  //     type: '',
  //     name: 'foo',
  //     raw: '    at foo (/my-project/foo.ts:4:8)'
  //   },
  // ]
```

_Note: `type` will be the string `"native"` if native code execution was detected._

## License

MIT, see [the license file](./LICENSE)
