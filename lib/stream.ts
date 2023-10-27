import { Playlist } from './playlist'

interface ResponseMessage {
  isFinal?: boolean;
  audio?: string;
  normalizedAlignment?: {
    chars?: string[];
  };
  [key: string]: any;
}

export interface TextStreamOptions {
  apiKey: string, voiceId: string
}

export class TextStream {
  private socket: WebSocket | undefined
  private apiKey: string | undefined

  playlist: Playlist

  // Docs for the options below:
  // https://docs.elevenlabs.io/api-reference/text-to-speech-websockets
  voiceId: string
  latency: number = 4
  stability: number = 0.65
  similarity_boost: number = 0.75
  model: string = 'eleven_monolingual_v1'

  verbose: boolean = false

  constructor(options: TextStreamOptions) {
    this.apiKey = options.apiKey
    this.voiceId = options.voiceId
  }

  createSocket(callback: () => void) {
    this.socket = new WebSocket(this.wsUrl())
    this.socket.onopen = () => {
      this.onOpen()
      callback()
    }

    this.socket.onmessage = this.onMessage.bind(this)
    this.socket.onclose = this.onClose.bind(this)

    // @ts-ignore
    this.socket.onerror = (err: Event) => {
      this.error('Socket error:', err)
    }
  }

  start() {
    this.log('Opening')

    return new Promise((resolve, reject) => {
      this.createSocket(() => {
	this.log('Ready')
	resolve(true)
      })
    })
  }

  clear() {
    this.socket = undefined
  }

  push(text: string) {
    if (!this.socket) {
      this.error('Socket not ready')
      return
    }

    this.log('Send', text)

    this.socket.send(JSON.stringify({
      text,
      voice_settings: this.voiceSettings(),
      xi_api_key: this.apiKey
    }))
  }

  end() {
    this.push('')
  }

  onOpen() {
    this.push(' ')
  }

  onMessage(event: MessageEvent) {
    const response: ResponseMessage = JSON.parse(event.data)

    this.log('Received message', response)

    if (!response.audio) {
      this.log('Received message with no audio')
      return
    }

    const text: string = response.normalizedAlignment?.chars?.join('') || ''
    this.playlist.push(text, response.audio, response.isFinal || false)
  }

  onClose() {
    this.log('Socket closed')
    this.clear()
  }

  onError(error: Error) {
    this.error('[eleven-labs-tts-strea] WebSocket Error: ', error)
  }

  wsUrl() {
    return `wss://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}/stream-input?model_type=${this.model}&optimize_streaming_latency=${this.latency}`
  }

  log(...args: unknown[]) {
    if (!this.verbose) {
      return
    }

    // @ts-ignore
    console.log.apply(console, ['[eleven-labs-tts/stream]'].concat(args))
  }

  error(...args: unknown[]) {
    // @ts-ignore
    console.error.apply(console, ['[eleven-labs-tts/stream]'].concat(args))
  }

  voiceSettings() {
    return {
      stability: this.stability,
      similarity_boost: this.similarity_boost
    }
  }
}
