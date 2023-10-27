import { TextStream, Playlist, textToSpeechStream } from '../lib/index'

document.querySelector('button').onclick = test

async function test() {
  const query = new URLSearchParams(window.location.search)

  const stream = textToSpeechStream({
    apiKey: query.get('api_key') || '',
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    verbose: true
  })

  await stream.start()

  stream.push('hi!')
  stream.push('this is')
  stream.push('a test')
  stream.push('message.')
  stream.end()
}
