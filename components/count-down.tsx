'use client';
import { useState, useRef, useEffect, ChangeEvent } from "react";

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>(''); // Duration input state
  const [timeLeft, setTimeLeft] = useState<number>(0); // Time left in the countdown
  const [isActive, setIsActive] = useState<boolean>(false); // Timer active state
  const [isPaused, setIsPaused] = useState<boolean>(false); // Timer pause state
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Timer reference

  // Handle setting the duration
  const handleSetDuration = (): void => {
    const parsedDuration = Number(duration);
    if (parsedDuration > 0) {
      setTimeLeft(parsedDuration);
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Handle starting the timer
  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  // Handle pausing the timer
  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Handle resetting the timer
  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(Number(duration) || 0); // Reset to original duration
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Timer effect to decrease the time left
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);

  // Format time as MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Handle input change for duration
  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(e.target.value || ""); // Keep the value as string or empty
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
          Countdown Timer
        </h1>

        {/* Duration input and set button */}
        <div className="flex items-center mb-6">
          <input
            type="number"
            id="duration"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChange}
            className="flex-1 mr-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <button
            onClick={handleSetDuration}
            className="text-gray-800 dark:text-gray-200 border rounded-md px-4 py-2"
          >
            Set
          </button>
        </div>

        {/* Display time left */}
        <div className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">
          {formatTime(timeLeft)}
        </div>

        {/* Control buttons: Start, Pause, Reset */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleStart}
            className="text-gray-800 dark:text-gray-200 border rounded-md px-4 py-2"
          >
            {isPaused ? "Resume" : "Start"}
          </button>

          <button
            onClick={handlePause}
            className="text-gray-800 dark:text-gray-200 border rounded-md px-4 py-2"
          >
            Pause
          </button>

          <button
            onClick={handleReset}
            className="text-gray-800 dark:text-gray-200 border rounded-md px-4 py-2"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
