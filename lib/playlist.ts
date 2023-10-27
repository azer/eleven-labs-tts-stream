interface PlaylistItem {
  base64Audio: string
  text: string
}

enum PlaylistStatus {
  Idle = 'idle',
  Playing = 'playing'
}

export class Playlist {
  private enabled: boolean = false
  private queue: PlaylistItem[] = []
  private stopFn: () => void

  index: number = -1
  status = PlaylistStatus.Idle
  verbose = false

  add(text: string, base64Audio: string) {
    this.queue.push({
      base64Audio,
      text
    })

    if (this.enabled && this.status === PlaylistStatus.Idle) {
      this.start()
    }
  }

  clear() {
    this.queue = []
    this.status = PlaylistStatus.Idle
  }

  start() {
    if (this.status === PlaylistStatus.Playing) return;
    if (!this.enabled) return;

    this.status = PlaylistStatus.Playing;

    this.playAtIndex(0, donePlaying)

    function donePlaying() {
      if (this.index + 1 >= this.queue.length) {
	this.clear();
      }

      this.playAtIndex(this.index + 1, donePlaying);
    }
  }

  playAtIndex(index: number, callback: () => void) {
    if (!this.enabled) return;

    this.log('Play audio at index:', index)

    this.index = index
    this.stopFn = playAudio(this.queue[index].base64Audio, callback)
  }

  stop() {
    this.stopFn()
  }

  end() {
    this.clear()
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

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);

  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

export function playAudio(base64Audio: string, callback: () => void): () => void {
  const audioBf = base64ToArrayBuffer(base64Audio)
  const copiedBuffer = audioBf.slice(0);
  const audioContext = new AudioContext();
  const sourceNode = audioContext.createBufferSource();

  audioContext
    .decodeAudioData(copiedBuffer)
    .then((audioBuffer) => {
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioContext.destination);
      sourceNode.start();
      sourceNode.addEventListener('ended', () => {
        sourceNode.disconnect();
        callback();
      });
    })
    .catch((err) => {
      throw err;
    });

  return () => {
    sourceNode.stop();
  };
}
