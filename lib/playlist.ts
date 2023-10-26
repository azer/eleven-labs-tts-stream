export class Playlist {
  add(text: string, audioBase64: string) {
    const buffer = base64ToArrayBuffer(audioBase64)

  }

  end() {

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

export function playAudio(audioBf: ArrayBuffer, callback: () => void): () => void {
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
