import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender_type: "visitor" | "admin";
  message: string;
  created_at: string;
}

interface Conversation {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  status: string;
}

// Ensures the visitor has an authenticated (anonymous) Supabase session
// so RLS policies can identify them via auth.uid() instead of a spoofable header.
const ensureVisitorSession = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) return session.user.id;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    if (import.meta.env.DEV) console.error("Anonymous sign-in failed:", error);
    return null;
  }
  return data.user.id;
};

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [showNameForm, setShowNameForm] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [visitorUserId, setVisitorUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && conversation) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [isOpen, conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Establish anonymous auth session, then look for an existing conversation.
    const init = async () => {
      const uid = await ensureVisitorSession();
      if (!uid) return;
      setVisitorUserId(uid);

      const { data } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("visitor_user_id", uid)
        .eq("status", "active")
        .maybeSingle();

      if (data) {
        setConversation(data as Conversation);
        setShowNameForm(false);
      }
    };
    init();
  }, []);

  const fetchMessages = async () => {
    if (!conversation) return;

    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true });

    if (data) {
      setMessages(data as Message[]);
      setUnreadCount(0);
    }
  };

  const subscribeToMessages = () => {
    if (!conversation) return;

    const channel = supabase
      .channel(`chat-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
          if (!isOpen && newMsg.sender_type === "admin") {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const startConversation = async () => {
    if (!visitorName.trim() || !visitorEmail.trim()) return;
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail.trim())) return;

    const uid = visitorUserId ?? (await ensureVisitorSession());
    if (!uid) return;
    if (!visitorUserId) setVisitorUserId(uid);

    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({
        visitor_id: uid,
        visitor_user_id: uid,
        visitor_name: visitorName,
        visitor_email: visitorEmail,
      })
      .select()
      .single();

    if (data && !error) {
      setConversation(data as Conversation);
      setShowNameForm(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation || isSending) return;

    setIsSending(true);
    const messageText = newMessage;
    setNewMessage("");

    const { error } = await supabase.from("chat_messages").insert({
      conversation_id: conversation.id,
      sender_type: "visitor",
      message: messageText,
    });

    if (error) {
      setNewMessage(messageText);
    }

    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showNameForm) {
        startConversation();
      } else {
        sendMessage();
      }
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setUnreadCount(0);
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-gold shadow-lg flex items-center justify-center gold-glow"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-10rem)] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="gradient-gold p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-foreground">Live Chat</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <p className="text-xs text-primary-foreground/90">
                    We're online — typically reply in minutes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>

            {/* Messages / Name Form */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {showNameForm ? (
                <div className="space-y-4">
                  <div className="glass rounded-xl p-4">
                    <p className="text-sm mb-4">
                      👋 Hi there! Please introduce yourself to start chatting.
                    </p>
                    <div className="space-y-3">
                      <Input
                        placeholder="Your name *"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="glass border-white/10"
                      />
                      <Input
                        placeholder="Email *"
                        type="email"
                        value={visitorEmail}
                        onChange={(e) => setVisitorEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="glass border-white/10"
                        required
                      />
                      <Button
                        onClick={startConversation}
                        disabled={
                          !visitorName.trim() ||
                          !visitorEmail.trim() ||
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail.trim())
                        }
                        className="w-full gradient-gold text-primary-foreground"
                      >
                        Start Chat
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      <p>👋 Hi {conversation?.visitor_name}!</p>
                      <p className="mt-2">Send us a message to get started.</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          msg.sender_type === "visitor"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            msg.sender_type === "visitor"
                              ? "gradient-gold text-primary-foreground rounded-br-sm"
                              : "glass rounded-bl-sm"
                          }`}
                        >
                          {msg.sender_type === "admin" && (
                            <div className="flex items-center gap-1 text-xs text-primary mb-1">
                              <User className="w-3 h-3" />
                              <span>Support</span>
                            </div>
                          )}
                          <p className="text-sm">{msg.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender_type === "visitor"
                                ? "text-primary-foreground/60"
                                : "text-muted-foreground"
                            }`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            {!showNameForm && (
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="glass border-white/10 flex-1"
                    disabled={isSending}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="gradient-gold text-primary-foreground"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
