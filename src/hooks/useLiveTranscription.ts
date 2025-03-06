import { useEffect, useState, useRef } from "react";

interface LiveTranscriptionReturn {
  transcript: string;
  error: string | null;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
}

/**
 * @param webSocketUrl The URL for your WebSocket server.
 * @param shouldStart  Whether to initialize mic + WS. If false, the effect is skipped.
 */
const useLiveTranscription = (
  webSocketUrl: string = process.env.NEXT_PUBLIC_AI_URL || "",
  shouldStart = true
): LiveTranscriptionReturn => {
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Tracks whether we *want* to capture mic input at all (once started).
  const [isRecording, setIsRecording] = useState(false);

  // Tracks whether server audio is currently playing. If true, we skip sending mic data.
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  // Optional: resume AudioContext on any user click (extra precaution)
  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current
          .resume()
          .then(() => {
            console.log("AudioContext resumed after user gesture.");
          })
          .catch((err) => {
            console.error("Error resuming AudioContext:", err);
          });
      }
    };
    document.addEventListener("click", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    // If we have not been told to start, do nothing
    if (!shouldStart) {
      return;
    }

    // let pingInterval: ReturnType<typeof setInterval>;

    const initLiveTranscription = async () => {
      try {
        // 1. Create WebSocket
        wsRef.current = new WebSocket(webSocketUrl);
        wsRef.current.binaryType = "arraybuffer";

        wsRef.current.onopen = () => {
          console.log("WebSocket connected");
          // setIsRecording(true);
        };

        wsRef.current.onmessage = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Received transcription:", data);

            // 2. Append transcript if present
            if (data.transcript) {
              setTranscript((prev) => prev + " " + data.transcript);
            } else if (data.error) {
              setError(data.error);
            }

            // 3. If there's audio from the server, play it
            if (data.audio) {
              playAudio(data.audio);
            }
          } catch (err) {
            console.error("Error parsing message:", err, "Raw data:", event.data);
            setError("Error parsing transcript message");
          }
        };

        // 4. Request microphone access
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        // 5. Create AudioContext
        audioContextRef.current = new AudioContext({
          sampleRate: 16000,
          latencyHint: "interactive",
        });

        const source = audioContextRef.current.createMediaStreamSource(streamRef.current);

        // 6. Create ScriptProcessor with smaller buffer size for continuous data
        processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

        // Debug info
        console.log("AudioContext created:", {
          sampleRate: audioContextRef.current.sampleRate,
          baseLatency: audioContextRef.current.baseLatency,
          outputLatency: audioContextRef.current.outputLatency,
        });

        // 7. Process & send audio data
        processorRef.current.onaudioprocess = (e) => {
          // Do not send audio if the server is playing audio
          if (isPlayingAudio || !isRecording) {
            return;
          }
          // Also skip if WS not open
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);

            // Convert to 16-bit PCM
            const pcmData = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              const s = Math.max(-1, Math.min(1, inputData[i]));
              pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }

            console.log("Sending audio chunk:", pcmData.length);
            wsRef.current.send(pcmData.buffer);
          }
        };

        // 8. Connect the nodes
        source.connect(processorRef.current);
        processorRef.current.connect(audioContextRef.current.destination);

        // 9. (Optional) Ping the server periodically to keep WS alive
        // pingInterval = setInterval(() => {
        //   if (wsRef.current?.readyState === WebSocket.OPEN) {
        //     wsRef.current.send(JSON.stringify({ ping: true }));
        //   }
        // }, 30000);

      } catch (err: any) {
        console.error("Initialization error:", err);
        setError(err.message || "Error initializing live transcription");
        setIsRecording(false);
      }
    };

    initLiveTranscription();

    // Cleanup
    return () => {
    //   if (pingInterval) clearInterval(pingInterval);
      setIsRecording(false);

      if (processorRef.current) {
        processorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [webSocketUrl, shouldStart, isPlayingAudio]);

  // Helper function to play base64 audio
  const playAudio = (base64Audio: string) => {
    console.log("Playing server audio; pausing mic capture");
    setIsPlayingAudio(true);

    const audioUrl = `data:audio/mp3;base64,${base64Audio}`;
    const audio = new Audio(audioUrl);

    // When audio ends, resume mic capture
    audio.onended = () => {
      console.log("Server audio ended; resuming mic capture");
      setTimeout(() => {
        setIsPlayingAudio(false);
        setIsRecording(true);
      }, 2000);
    };

    audio.play().catch((error) => {
      console.error("Audio playback error:", error);
      // Even if playback fails, ensure we resume mic capture
      setIsPlayingAudio(false);
    });
  };

  return { transcript, error, isRecording, setIsRecording };
};

export default useLiveTranscription;