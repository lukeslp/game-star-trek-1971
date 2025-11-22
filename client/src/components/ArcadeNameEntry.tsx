import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ArcadeNameEntryProps {
  onSubmit: (name: string) => void;
  initialName?: string;
}

// All valid characters: A-Z, 0-9, and space
const VALID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";

export default function ArcadeNameEntry({ onSubmit, initialName = "AAA" }: ArcadeNameEntryProps) {
  const [chars, setChars] = useState<string[]>(
    initialName.toUpperCase().slice(0, 3).padEnd(3, " ").split("")
  );
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const cycleChar = (index: number, direction: 1 | -1) => {
    const currentChar = chars[index];
    const currentIndex = VALID_CHARS.indexOf(currentChar);
    const newIndex = (currentIndex + direction + VALID_CHARS.length) % VALID_CHARS.length;
    const newChars = [...chars];
    newChars[index] = VALID_CHARS[newIndex];
    setChars(newChars);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      cycleChar(index, -1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      cycleChar(index, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (index > 0) {
        setFocusedIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowRight" || e.key === "Tab") {
      e.preventDefault();
      if (index < 2) {
        setFocusedIndex(index + 1);
        inputRefs.current[index + 1]?.focus();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Backspace") {
      e.preventDefault();
      const newChars = [...chars];
      newChars[index] = " ";
      setChars(newChars);
      if (index > 0) {
        setFocusedIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleChange = (value: string, index: number) => {
    // Convert to uppercase and take last character
    const char = value.toUpperCase().slice(-1);

    // Only allow valid characters
    if (char === "" || VALID_CHARS.includes(char)) {
      const newChars = [...chars];
      newChars[index] = char || " ";
      setChars(newChars);

      // Auto-advance to next field if we typed a character
      if (char && index < 2) {
        setFocusedIndex(index + 1);
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSubmit = () => {
    const name = chars.join("").trim() || "AAA";
    onSubmit(name);
  };

  return (
    <div className="status-panel max-w-md mx-auto">
      <h3 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider text-center">
        Enter Your Initials
      </h3>

      <div className="flex items-center justify-center gap-3 mb-6">
        {chars.map((char, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            {/* Up Arrow */}
            <button
              onClick={() => cycleChar(index, -1)}
              className="text-primary hover:text-primary/70 transition-colors"
              aria-label="Previous character"
            >
              <ChevronUp className="w-6 h-6" />
            </button>

            {/* Character Input */}
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              value={char === " " ? "" : char}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              maxLength={1}
              className="w-16 h-20 text-4xl font-bold text-center bg-black/50 border-2 border-primary/50 text-primary focus:border-primary focus:ring-2 focus:ring-primary/50 rounded font-mono uppercase"
              style={{ textShadow: "0 0 10px currentColor" }}
            />

            {/* Down Arrow */}
            <button
              onClick={() => cycleChar(index, 1)}
              className="text-primary hover:text-primary/70 transition-colors"
              aria-label="Next character"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground mb-4">
        <p>Type or use ↑↓ arrows to change letters</p>
        <p>Use ←→ or Tab to move between positions</p>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/80 text-lg py-6"
        style={{ textShadow: "0 0 5px currentColor" }}
      >
        Confirm
      </Button>
    </div>
  );
}
