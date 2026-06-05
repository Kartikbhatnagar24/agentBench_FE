import { useState, useEffect } from 'react';

/**
 * Custom hook to type out text letter-by-letter.
 * @param text The string to type out.
 * @param speed Typing speed in milliseconds per character.
 * @param delay Startup delay in milliseconds before typing begins.
 */
export const useTypingEffect = (text: string, speed = 40, delay = 100) => {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    let index = 0;
    let timer: any;

    const type = () => {
      if (index <= text.length) {
        setTypedText(text.slice(0, index));
        index++;
        timer = setTimeout(type, speed);
      }
    };

    const startTimer = setTimeout(type, delay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, [text, speed, delay]);

  return typedText;
};
