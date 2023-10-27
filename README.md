# eleven-labs-tts-stream

Library for real-time streaming LLM output to Eleven Labs' text-to-speech API. 

**Work in progress:**

- [x] WebSocket wrapper for streaming text
- [x] Playlist for playing audio in order
- [ ] Missing methods:
  - [x] `TextStream.open`
  - [ ] `Playlist.enable`
  - [x] `TextStream.close`
- [ ] Get example working
- [ ] Tests
- [ ] React hook

## Install

```bash
$ npm i @azer/eleven-labs-tts-stream
```

## Usage

```ts
import { TextStream, Playlist } from 'eleven-labs-tts-stream'

const stream = new TextStream('voice-id-here')

stream.playlist = new Playlist()
stream.playlist.enable()

await stream.open()

stream.push('Hi!')
stream.push('This is')
stream.push('a test.')
```
