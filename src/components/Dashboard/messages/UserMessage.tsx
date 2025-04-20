"use client";

import { useEffect, useState } from "react";
import { FaComments, FaRegCommentDots, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import Overlay from "@/components/ui/Overlay";
import { FullScreenLoader } from "@/components/ui/Loader";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { messageService } from "@/service/message.service";

interface Message {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  senderId: string;
}

export default function MessageInbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useUser();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!user?.uid) return;

        const messages = await messageService.getUserMessages(user.uid);
        setMessages(messages);
        setError("");
      } catch (err) {
        setError("Failed to load messages");
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user?.uid]);

  const handleMessageOpen = async (message: Message) => {
    try {
      setSelectedMessage(message);
      if (!message.read) {
        await messageService.markMessageAsRead(message.id);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id ? { ...msg, read: true } : msg
          )
        );
      }
    } catch (err) {
      toast.error("Failed to update message status");
    }
  };

  if (loading) return <FullScreenLoader />;
  if (error)
    return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FaComments className="w-8 h-8 text-primary-red" />
          <h1 className="text-2xl font-bold text-gray-800">My Messages</h1>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <FaRegCommentDots className="mx-auto w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No messages found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "bg-white rounded-xl p-6 shadow-sm cursor-pointer transition-all",
                  "hover:shadow-md border-l-4",
                  message.read
                    ? "border-gray-200 hover:border-gray-300"
                    : "border-primary-red/80 bg-primary-red/5"
                )}
                onClick={() => handleMessageOpen(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-600 line-clamp-2 mb-2">
                      {message.message}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">
                        {formatDistanceToNow(message.timestamp, {
                          addSuffix: true,
                        })}
                      </span>
                      {!message.read && (
                        <span className="w-2 h-2 bg-primary-red rounded-full animate-pulse"></span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedMessage && (
          <Overlay onClose={() => setSelectedMessage(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Admin Message
                  </h3>
                  <p className="text-sm text-gray-400">
                    {formatDistanceToNow(selectedMessage.timestamp, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <div className="prose prose-sm max-w-none text-gray-600">
                {selectedMessage.message}
              </div>

              <div className="mt-6 border-t pt-4">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="w-full px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Close Message
                </button>
              </div>
            </motion.div>
          </Overlay>
        )}
      </div>
    </div>
  );
}
