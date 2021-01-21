export interface Recording {
  duration: number;
  data: Blob;
  imageSrc: string;
  audioSrc: string;
  timestamp: number;
}

export interface Clip {
  duration: number;
  audio: HTMLAudioElement;
  imageSrc: string;
  start: number;
  width: number;
  dragOffset?: number;
  styles: {
    left: string;
  };
  id: number;
  element?: HTMLImageElement;
}

export interface Track {
  clips: Clip[];
  id: number;
}
