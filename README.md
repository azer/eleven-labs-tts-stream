# eleven-labs-tts-stream

Library for real-time streaming LLM output to Eleven Labs' text-to-speech API. 

**Work in progress:**

- [x] Vanilla JavaScript library
- [ ] React hook

## Install

```bash
$ npm i @azer/eleven-labs-tts-stream
```

## Usage

```ts

import { textToSpeechStream } from 'eleven-labs-tts-stream'

const stream = textToSpeechStream({
    apiKey: '<eleven labs api key>',
    voiceId: '<voice id>',
    verbose: true // turns on verbose mode for logging
})

// Make sure socket is initialized & ready
await stream.start()

stream.push('hi!')
stream.push('this is')
stream.push('a test')
stream.push('message.')

// Indicate end of input
stream.end()
```

Alternatively, object-orient API can be used for more granular control;

```ts
import { TextStream, Playlist } from 'eleven-labs-tts-stream'

const stream = new TextStream({ apiKey: '..', voiceId: '...' })
stream.playlist = new Playlist()

await stream.start()
stream.push('hello')
stream.push('world')
stream.end()
```

## Examples

To run examples locally;

```
$ npm run serve-examples
# go to http://127.0.0.1:8001/simple.html?api_key=<eleven labs key here>
```
