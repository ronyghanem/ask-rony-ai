interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;

  start(): void;
  stop(): void;

  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: any) => void) | null;
  onresult:
    ((event: SpeechRecognitionEvent) => void) | null;
}


interface Window {
  SpeechRecognition:
    typeof SpeechRecognition;

  webkitSpeechRecognition:
    typeof SpeechRecognition;
}