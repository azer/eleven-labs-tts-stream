import { Playlist } from "./playlist";
import { TextStreamOptions, TextStream } from "./stream";
export { Playlist } from "./playlist";

export function textToSpeechStream(options: TextStreamOptions & { verbose?: boolean }) {
  const stream = new TextStream(options)
  stream.verbose = options.verbose || false

  stream.playlist = new Playlist()
  stream.playlist.verbose = options.verbose || false

  return stream
}
