# eleven-labs-tts-stream

Library for real-time streaming LLM output to Eleven Labs' text-to-speech API.

## Install

```bash
$ npm i @azer/eleven-labs-tts-stream
```

## Usage

```ts
import { TextStream, Playlist } from 'eleven-labs-tts-stream'

const stream = new TextStream('voice-id-here')
stream.playlist = new Playlist()

stream.push('Hi!')
stream.push('This is')
stream.push('a test.')
```
