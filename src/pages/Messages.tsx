import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft, MessageSquare, Search } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  listing_id: string | null;
}

interface Conversation {
  user_id: string;
  user_name: string;
  user_avatar: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/giris");
    }
  }, [user, authLoading, navigate]);

  // Load conversations
  useEffect(() => {
    if (!user) return;
    
    const loadConversations = async () => {
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!msgs || msgs.length === 0) return;

      // Group by conversation partner
      const convMap = new Map<string, Conversation>();
      for (const msg of msgs) {
        const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!convMap.has(partnerId)) {
          convMap.set(partnerId, {
            user_id: partnerId,
            user_name: partnerId.substring(0, 8),
            user_avatar: "?",
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: msg.receiver_id === user.id && !msg.is_read ? 1 : 0,
          });
        } else {
          const conv = convMap.get(partnerId)!;
          if (msg.receiver_id === user.id && !msg.is_read) {
            conv.unread_count++;
          }
        }
      }

      // Load profile names
      const partnerIds = Array.from(convMap.keys());
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", partnerIds);

      if (profiles) {
        for (const p of profiles) {
          const conv = convMap.get(p.user_id);
          if (conv) {
            conv.user_name = p.name;
            conv.user_avatar = p.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
          }
        }
      }

      setConversations(Array.from(convMap.values()));
    };

    loadConversations();

    // Real-time subscription
    const channel = supabase
      .channel("messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_id === user.id || msg.receiver_id === user.id) {
          loadConversations();
          if (selectedConversation && (msg.sender_id === selectedConversation || msg.receiver_id === selectedConversation)) {
            setMessages(prev => [...prev, msg]);
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, selectedConversation]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!user || !selectedConversation) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedConversation}),and(sender_id.eq.${selectedConversation},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);

      // Mark as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", selectedConversation)
        .eq("receiver_id", user.id)
        .eq("is_read", false);
    };

    loadMessages();
  }, [user, selectedConversation]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedConversation) return;
    setSending(true);

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedConversation,
      content: newMessage.trim(),
    });

    if (error) {
      toast.error("Mesaj gönderilemedi");
    } else {
      setNewMessage("");
    }
    setSending(false);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Şimdi";
    if (mins < 60) return `${mins}dk`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}sa`;
    const days = Math.floor(hours / 24);
    return `${days}g`;
  };

  const filteredConversations = conversations.filter(c =>
    c.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) return null;
  if (!user) return null;

  const selectedUser = conversations.find(c => c.user_id === selectedConversation);

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Mesajlar" description="Mesajlarınızı görüntüleyin ve yanıtlayın." path="/mesajlar" />
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="rounded-2xl bg-card shadow-card overflow-hidden" style={{ height: "calc(100vh - 160px)" }}>
          <div className="grid h-full md:grid-cols-[340px_1fr]">
            {/* Conversations List */}
            <div className={`border-r flex flex-col ${selectedConversation ? "hidden md:flex" : "flex"}`}>
              <div className="p-4 border-b">
                <h2 className="font-display text-lg font-bold text-foreground mb-3">Mesajlar</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Kişi ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <ScrollArea className="flex-1">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">Henüz mesajınız yok</p>
                    <p className="text-xs text-muted-foreground mt-1">Profillere mesaj göndererek başlayın</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.user_id}
                      onClick={() => setSelectedConversation(conv.user_id)}
                      className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50 ${
                        selectedConversation === conv.user_id ? "bg-muted" : ""
                      }`}
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-accent/10 text-accent text-sm font-bold">
                          {conv.user_avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground text-sm truncate">{conv.user_name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">{formatTime(conv.last_message_time)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.last_message}</p>
                      </div>
                      {conv.unread_count > 0 && (
                        <Badge className="bg-accent text-accent-foreground text-xs shrink-0">
                          {conv.unread_count}
                        </Badge>
                      )}
                    </button>
                  ))
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className={`flex flex-col ${!selectedConversation ? "hidden md:flex" : "flex"}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center gap-3 p-4 border-b">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-accent/10 text-accent text-sm font-bold">
                        {selectedUser?.user_avatar || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground text-sm">{selectedUser?.user_name || "Kullanıcı"}</p>
                      <p className="text-xs text-muted-foreground">Aktif</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {messages.map((msg) => {
                        const isMine = msg.sender_id === user.id;
                        return (
                          <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                                isMine
                                  ? "bg-accent text-accent-foreground rounded-br-md"
                                  : "bg-muted text-foreground rounded-bl-md"
                              }`}
                            >
                              <p>{msg.content}</p>
                              <p className={`text-[10px] mt-1 ${isMine ? "text-accent-foreground/60" : "text-muted-foreground"}`}>
                                {formatTime(msg.created_at)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="p-4 border-t">
                    <form
                      onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                      className="flex gap-2"
                    >
                      <Input
                        placeholder="Mesajınızı yazın..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" variant="hero" size="icon" disabled={!newMessage.trim() || sending}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="mx-auto mb-4 h-16 w-16 text-muted-foreground/20" />
                    <h3 className="font-display text-lg font-semibold text-foreground">Mesaj seçin</h3>
                    <p className="text-sm text-muted-foreground mt-1">Sol taraftan bir sohbet seçin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
