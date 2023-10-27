import { TextStream, Playlist } from '../lib/index'

document.querySelector('button').onclick = test

async function test() {
  const query = new URLSearchParams(window.location.search)
  const stream = new TextStream({
    apiKey: query.get('api_key') || '',
    voiceId: 'EXAVITQu4vr4xnSDxMaL'
  })

  stream.playlist = new Playlist()
  stream.verbose = true
  stream.playlist.enable()

  await stream.start()

  stream.push('hi!')
  stream.push('this is')
  stream.push('a test')
  stream.push('message.')
  stream.end()

  setTimeout(async () => {
    await stream.start()

    stream.push('how')
    stream.push('are')
    stream.push('you')
    stream.push('today?')
    stream.end()
  }, 100)
}
