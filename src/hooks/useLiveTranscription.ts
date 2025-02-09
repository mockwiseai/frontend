// Frontend: useLiveTranscription.ts
import { useEffect, useState, useRef } from "react";

interface LiveTranscriptionReturn {
    transcript: string;
    error: string | null;
    isRecording: boolean;
    setIsRecording: (isRecording: boolean) => void;
}

const useLiveTranscription = (
    webSocketUrl: string = "ws://localhost:8002/ws/interview",
): LiveTranscriptionReturn => {
    const [transcript, setTranscript] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    useEffect(() => {
        const initLiveTranscription = async () => {
            try {
                // Create WebSocket with specific configuration
                wsRef.current = new WebSocket(webSocketUrl);
                wsRef.current.binaryType = "arraybuffer";

                wsRef.current.onopen = () => {
                    console.log("WebSocket connected");
                    setIsRecording(true);
                };

                wsRef.current.onmessage = (event: MessageEvent) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log("Received transcription:", data);
                        if (data.transcript) {
                            setTranscript((prev) => prev + " " + data.transcript);
                        } else if (data.error) {
                            setError(data.error);
                        }

                        if (data.audio) {
                            // if previous audio is playing, stop it
                            if (audioContextRef.current?.state === "running") {
                                audioContextRef.current.suspend();
                            }
                            
                            playAudio(data.audio);
                        }
                    } catch (err) {
                        console.error("Error parsing message:", err, "Raw data:", event.data);
                        setError("Error parsing transcript message");
                    }
                };

                // Get microphone access with specific configuration
                streamRef.current = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        channelCount: 1,
                        sampleRate: 16000,
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });

                // Initialize audio context with exact requirements
                audioContextRef.current = new AudioContext({
                    sampleRate: 16000,
                    latencyHint: 'interactive'
                });

                const source = audioContextRef.current.createMediaStreamSource(streamRef.current);

                // Use a larger buffer size for more stable processing
                processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

                // Debug the actual audio context state
                console.log("Audio Context State:", {
                    sampleRate: audioContextRef.current.sampleRate,
                    baseLatency: audioContextRef.current.baseLatency,
                    outputLatency: audioContextRef.current.outputLatency
                });

                processorRef.current.onaudioprocess = (e) => {
                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                        const inputData = e.inputBuffer.getChannelData(0);

                        // Convert to 16-bit PCM with proper scaling
                        const pcmData = new Int16Array(inputData.length);
                        for (let i = 0; i < inputData.length; i++) {
                            // Properly scale and clip the audio data
                            const s = Math.max(-1, Math.min(1, inputData[i]));
                            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                        }

                        // Log audio levels periodically for debugging
                        if (Math.random() < 0.01) { // Log ~1% of chunks
                            const level = Math.sqrt(inputData.reduce((acc, val) => acc + val * val, 0) / inputData.length);
                            console.log("Audio level:", level.toFixed(3), "Buffer size:", pcmData.length);
                        }

                        wsRef.current.send(pcmData.buffer);
                    }
                };

                source.connect(processorRef.current);
                processorRef.current.connect(audioContextRef.current.destination);

            } catch (err: any) {
                console.error("Initialization error:", err);
                setError(err.message || "Error initializing live transcription");
                setIsRecording(false);
            }
        };

        initLiveTranscription();

        return () => {
            setIsRecording(false);
            if (processorRef.current) {
                processorRef.current.disconnect();
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [webSocketUrl]);

    // Helper function to play base64 audio
    const playAudio = (base64Audio: string) => {
        // Create a data URL with the proper MIME type
        const audioUrl = `data:audio/mp3;base64,${base64Audio}`;
        const audio = new Audio(audioUrl);
        audio.play().catch(error => {
            console.error("Audio playback error:", error);
        });
    };
    return { transcript, error, isRecording, setIsRecording };
};

export default useLiveTranscription;