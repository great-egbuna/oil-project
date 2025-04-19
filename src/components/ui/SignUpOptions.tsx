import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  isOpen: boolean;
  onSelect: (value: string) => void;
  mainItems: { label: string; value: string }[];
  subItems: { label: string; value: string }[];
  othersLabel?: string;
  className?: string;
}

const SignUpOptions = ({
  isOpen,
  onSelect,
  mainItems,
  subItems,
  othersLabel = "Others",
  className,
}: DropdownMenuProps) => {
  const [isOthersOpen, setIsOthersOpen] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white z-50 w-full  ",
            {
              [className as string]: className,
            }
          )}
        >
          <div className="py-1 w-full">
            {mainItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onSelect(item.value)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </button>
            ))}

            <div className="relative group">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOthersOpen(!isOthersOpen)}
              >
                {othersLabel}
              </button>

              <AnimatePresence>
                {isOthersOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full w-56 bg-white rounded-md shadow-lg z-50"
                  >
                    {subItems.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => onSelect(item.value)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignUpOptions;
