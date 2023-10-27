import { Playlist } from './playlist'

export class TextStream {
  private socket: WebSocket

  playlist: Playlist

  // Docs for the options below:
  // https://docs.elevenlabs.io/api-reference/text-to-speech-websockets
  voiceId: string
  latency: number = 4
  stability: number = 0.65
  similarity_boost: number = 0.75
  model: string = 'eleven_monolingual_v1'

  verbose: boolean = false

  constructor(voiceId: string) {
    this.voiceId = voiceId
  }

  createSocket() {
    this.socket = new WebSocket(this.wsUrl())
    this.socket.onopen = this.onOpen
    this.socket.onmessage = this.onMessage
    this.socket.onclose = this.onClose
  }

  clear() {
    this.socket = undefined
  }

  send(text: string) {
    this.socket.send(JSON.stringify({
      text,
      voice_settings: this.voiceSettings()
    }))
  }

  onOpen() {
    this.log('Socket open')
    this.sendText(' ')
  }

  onMessage(event: MessageEvent) {
    const response = JSON.parse(event.data)

    this.log('Received message', response)

    if (response.isFinal) {
      this.playlist.end()
      return
    }

    if (!response.audio) {
      this.log('Received message with no audio')
    }

    // @ts-ignore
    const text: string = response.normalizedAlignment?.chars?.join(' ') | ''

    this.playlist.add(text, response.audio)
  }

  onClose() {
    this.log('Socket closed')
  }

  onError(error: Error) {
    this.error('[eleven-labs-tts-strea] WebSocket Error: ', error)
  }

  wsUrl() {
    return `wss://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}/stream-input?model_type=${this.model}&optimize_streaming_latency=${this.latency}`
  }

  voiceSettings() {
    return {
      stability: this.stability,
      similarity_boost: this.similarity_boost
    }
  }

  log(...args: unknown[]) {
    if (!this.verbose) {
      return
    }

    // @ts-ignore
    console.log(['[eleven-labs-tts-stream]'].concat(args))
  }

  error(...args: unknown[]) {
    // @ts-ignore
    console.error(['[eleven-labs-tts-stream]'].concat(args))
  }
}
