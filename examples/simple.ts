import { TextStream, Playlist } from '../lib/index'

main()

async function main() {
  const stream = new TextStream('model-id')
  stream.playlist = new Playlist()

  await stream.open()
}
