import { useState, useEffect } from 'react';

export function useSimulatedStreaming(fullText: string, isStreaming: boolean, onComplete?: () => void) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(fullText);
      return;
    }

    setDisplayedText('');
    const words = fullText.split(' ');
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedText((prev) => {
          const space = prev.length > 0 ? ' ' : '';
          return prev + space + words[currentIndex];
        });
        currentIndex++;
      } else {
        clearInterval(intervalId);
        if (onComplete) {
          onComplete();
        }
      }
    }, 30); // 30ms delay per word simulates realistic typing speed

    return () => clearInterval(intervalId);
  }, [fullText, isStreaming, onComplete]);

  return displayedText;
}
