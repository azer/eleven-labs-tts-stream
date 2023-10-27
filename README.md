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
import { TextStream, Playlist } from 'eleven-labs-tts-stream'

const stream = new TextStream({
    apiKey: query.get('api_key') || '',
    voiceId: 'EXAVITQu4vr4xnSDxMaL'
})

stream.playlist = new Playlist()
stream.playlist.enable()

await stream.start()

// Start sending messages
stream.push('hi!')
stream.push('this is')
stream.push('a test')
stream.push('message.')

// Call `end` method 
stream.end()
```

## Examples

To run examples locally;

```
$ npm run serve-examples
# go to http://127.0.0.1:8001/simple.html?api_key=<eleven labs key here>
```
