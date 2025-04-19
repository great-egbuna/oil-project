import { motion } from "framer-motion";
const Overlay = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="fixed inset-0 bg-black/50 z-50 flex  items-center justify-center px-4"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-[500px]"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </motion.div>
);

export default Overlay;
