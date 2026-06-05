import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Check,
  X,
  Trash2,
  Edit2,
  Award,
  LogOut,
  ArrowLeft,
  Mail,
  Calendar,
  RefreshCw,
  MessageSquare,
  FileText,
  Users,
  Send,
  Eye,
  EyeOff,
  Archive,
  Plus,
  ClipboardList,
  BarChart3,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemAuditAdmin } from "@/components/admin/SystemAuditAdmin";
import { AnalyticsAdmin } from "@/components/admin/AnalyticsAdmin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { shouldRegenerateCover } from "@/lib/blogCover";

// Types
interface Review {
  id: string;
  name: string;
  company: string | null;
  email: string;
  star_rating: number;
  message: string;
  status: "pending" | "approved" | "rejected";
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_name: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string;
  budget_range: string | null;
  custom_budget: string | null;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

interface ChatConversation {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: "visitor" | "admin";
  message: string;
  is_read: boolean;
  created_at: string;
}

type FilterStatus = "all" | "pending" | "approved" | "rejected";
type ContactFilter = "all" | "new" | "read" | "responded" | "archived";
type BlogFilter = "all" | "draft" | "published";

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin, signOut } = useAuth();
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ name: "", company: "", message: "" });

  // Blog state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [isBackfilling, setIsBackfilling] = useState(false);
  const [blogFilter, setBlogFilter] = useState<BlogFilter>("all");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postForm, setPostForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    author_name: "Admin",
    status: "draft",
  });

  // Contacts state
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [contactFilter, setContactFilter] = useState<ContactFilter>("all");
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const ADMIN_REPLY_TO = "theheroesagency.info@gmail.com";

  // Chat state
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchReviews();
      fetchPosts();
      fetchContacts();
      fetchConversations();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (selectedConversation) {
      fetchChatMessages(selectedConversation.id);
      subscribeToChatMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Real-time admin notifications: new leads, status -> responded, new visitor chat messages
  useEffect(() => {
    if (!user || !isAdmin) return;

    // Best-effort browser notification permission (silent if denied)
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
    const notify = (title: string, body: string) => {
      try {
        if ("Notification" in window && Notification.permission === "granted" && document.visibilityState !== "visible") {
          new Notification(title, { body, icon: "/favicon.ico" });
        }
      } catch {}
    };

    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_submissions" },
        (payload) => {
          const row = payload.new as ContactSubmission;
          setContacts((prev) => (prev.some((c) => c.id === row.id) ? prev : [row, ...prev]));
          toast({
            title: `New ${row.service || "lead"} from ${row.name}`,
            description: row.message?.slice(0, 120) || row.email,
          });
          notify("New lead received", `${row.name} — ${row.email}`);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "contact_submissions" },
        (payload) => {
          const next = payload.new as ContactSubmission;
          const prev = payload.old as Partial<ContactSubmission>;
          setContacts((list) => list.map((c) => (c.id === next.id ? { ...c, ...next } : c)));
          if (next.status === "responded" && prev.status !== "responded") {
            toast({
              title: "Lead marked as responded",
              description: `${next.name} (${next.email})`,
            });
            notify("Lead marked as responded", `${next.name} — ${next.email}`);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const msg = payload.new as ChatMessage;
          // Only notify on visitor-sent messages; ignore admin echoes
          if ((msg as any).sender_type && (msg as any).sender_type !== "visitor") return;
          // Skip if user is already viewing this conversation
          if (selectedConversation?.id === msg.conversation_id) return;
          toast({
            title: "New chat message",
            description: msg.message?.slice(0, 140) || "Visitor sent a new message",
          });
          notify("New chat message", msg.message?.slice(0, 140) || "Visitor sent a message");
          // Refresh conversation list so unread surfaces
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin, selectedConversation?.id]);

  // Reviews functions
  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      let query = supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      import.meta.env.DEV && console.error("Error fetching reviews:", error);
      toast({ title: "Error", description: "Failed to load reviews", variant: "destructive" });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const updateReviewStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
      if (error) throw error;
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      toast({ title: "Success", description: `Review ${status}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update review", variant: "destructive" });
    }
  };

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase.from("reviews").update({ is_featured: !isFeatured }).eq("id", id);
      if (error) throw error;
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_featured: !isFeatured } : r)));
      toast({ title: "Success", description: isFeatured ? "Removed from featured" : "Added to featured" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update review", variant: "destructive" });
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Success", description: "Review deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete review", variant: "destructive" });
    }
  };

  const startEditingReview = (review: Review) => {
    setEditingReview(review);
    setEditForm({ name: review.name, company: review.company || "", message: review.message });
  };

  const saveReviewEdit = async () => {
    if (!editingReview) return;
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ name: editForm.name, company: editForm.company || null, message: editForm.message })
        .eq("id", editingReview.id);
      if (error) throw error;
      setReviews((prev) =>
        prev.map((r) => (r.id === editingReview.id ? { ...r, ...editForm, company: editForm.company || null } : r))
      );
      setEditingReview(null);
      toast({ title: "Success", description: "Review updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update review", variant: "destructive" });
    }
  };

  // Blog functions
  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setPosts((data || []) as BlogPost[]);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load posts", variant: "destructive" });
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const createSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const generateCoverImage = async (): Promise<string | null> => {
    if (!postForm.title.trim()) {
      toast({ title: "Add a title first", description: "We need the post title to generate a fitting image.", variant: "destructive" });
      return null;
    }
    setIsGeneratingCover(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-cover", {
        body: { title: postForm.title, excerpt: postForm.excerpt },
      });
      if (error) throw error;
      const url = (data as { url?: string })?.url;
      if (!url) throw new Error("No URL returned");
      setPostForm((prev) => ({ ...prev, cover_image_url: url }));
      toast({ title: "Cover image generated" });
      return url;
    } catch (e) {
      toast({ title: "Image generation failed", description: String(e), variant: "destructive" });
      return null;
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const regenerateCoversFor = async (target: "missing" | "all") => {
    const candidates =
      target === "all" ? posts : posts.filter((p) => !p.cover_image_url?.trim());
    if (candidates.length === 0) {
      toast({ title: "All set", description: "No posts to regenerate." });
      return;
    }
    setIsBackfilling(true);
    let success = 0;
    let failed = 0;
    for (const post of candidates) {
      try {
        const { data, error } = await supabase.functions.invoke("generate-blog-cover", {
          body: { title: post.title, excerpt: post.excerpt ?? undefined },
        });
        if (error) throw error;
        const url = (data as { url?: string })?.url;
        if (!url) throw new Error("No URL returned");
        const { error: upErr } = await supabase
          .from("blog_posts")
          .update({ cover_image_url: url })
          .eq("id", post.id);
        if (upErr) throw upErr;
        setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, cover_image_url: url } : p)));
        success += 1;
      } catch (e) {
        console.error("Cover generation failed for", post.id, e);
        failed += 1;
      }
    }
    setIsBackfilling(false);
    toast({
      title: target === "all" ? "Regeneration complete" : "Backfill complete",
      description: `${success} cover${success === 1 ? "" : "s"} ${target === "all" ? "regenerated" : "generated"}${failed ? `, ${failed} failed` : ""}.`,
    });
  };

  const backfillMissingCovers = () => regenerateCoversFor("missing");
  const regenerateAllCovers = () => regenerateCoversFor("all");

  const [isPolishing, setIsPolishing] = useState(false);
  const polishAllPosts = async () => {
    if (posts.length === 0) {
      toast({ title: "Nothing to polish", description: "No posts found." });
      return;
    }
    setIsPolishing(true);
    let success = 0;
    let failed = 0;
    for (const post of posts) {
      try {
        const { data, error } = await supabase.functions.invoke("polish-blog-post", {
          body: { id: post.id },
        });
        if (error) throw error;
        const updated = data as { title?: string; excerpt?: string; content?: string };
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? {
                  ...p,
                  title: updated.title ?? p.title,
                  excerpt: updated.excerpt ?? p.excerpt,
                  content: updated.content ?? p.content,
                }
              : p,
          ),
        );
        success += 1;
      } catch (e) {
        console.error("Polish failed for", post.id, e);
        failed += 1;
      }
    }
    setIsPolishing(false);
    toast({
      title: "Polish complete",
      description: `${success} post${success === 1 ? "" : "s"} polished${failed ? `, ${failed} failed` : ""}.`,
    });
  };




  const savePost = async () => {
    try {
      let coverUrl = postForm.cover_image_url;
      const shouldRegenerate = shouldRegenerateCover({
        form: {
          title: postForm.title,
          excerpt: postForm.excerpt,
          cover_image_url: postForm.cover_image_url,
        },
        editing: editingPost,
      });
      if (shouldRegenerate) {
        const generated = await generateCoverImage();
        if (generated) coverUrl = generated;
      }
      const postData = {
        ...postForm,
        cover_image_url: coverUrl || null,
        slug: postForm.slug || createSlug(postForm.title),
        published_at: postForm.status === "published" ? new Date().toISOString() : null,
      };

      if (editingPost) {
        const { error } = await supabase.from("blog_posts").update(postData).eq("id", editingPost.id);
        if (error) throw error;
        setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? { ...p, ...postData } : p)));
        toast({ title: "Success", description: "Post updated" });
      } else {
        const { data, error } = await supabase.from("blog_posts").insert(postData).select().single();
        if (error) throw error;
        setPosts((prev) => [data, ...prev]);
        toast({ title: "Success", description: "Post created" });
      }

      setEditingPost(null);
      setPostForm({ title: "", slug: "", excerpt: "", content: "", cover_image_url: "", author_name: "Admin", status: "draft" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save post", variant: "destructive" });
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Success", description: "Post deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
    }
  };

  const startEditingPost = (post: BlogPost) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      cover_image_url: post.cover_image_url || "",
      author_name: post.author_name,
      status: post.status,
    });
  };

  // Contact functions
  const fetchContacts = async () => {
    setIsLoadingContacts(true);
    try {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setContacts((data || []) as ContactSubmission[]);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load contacts", variant: "destructive" });
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
      if (error) throw error;
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      toast({ title: "Success", description: "Status updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const saveContactNotes = async () => {
    if (!selectedContact) return;
    try {
      const { error } = await supabase.from("contact_submissions").update({ admin_notes: adminNotes }).eq("id", selectedContact.id);
      if (error) throw error;
      setContacts((prev) => prev.map((c) => (c.id === selectedContact.id ? { ...c, admin_notes: adminNotes } : c)));
      toast({ title: "Success", description: "Notes saved" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save notes", variant: "destructive" });
    }
  };

  const sendReply = async () => {
    if (!selectedContact) return;
    const subject = replySubject.trim();
    const message = replyMessage.trim();
    if (!subject || !message) {
      toast({ title: "Missing fields", description: "Add a subject and a message before sending.", variant: "destructive" });
      return;
    }
    if (message.length > 5000 || subject.length > 200) {
      toast({ title: "Too long", description: "Subject must be ≤200 and message ≤5000 characters.", variant: "destructive" });
      return;
    }
    setIsSendingReply(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "admin-reply",
          recipientEmail: selectedContact.email,
          replyTo: ADMIN_REPLY_TO,
          idempotencyKey: `admin-reply-${selectedContact.id}-${Date.now()}`,
          templateData: {
            recipientName: selectedContact.name,
            subject,
            message,
            senderName: "The Heroes Agency",
          },
        },
      });
      if (error) throw error;
      if (data && (data as any).success === false) {
        throw new Error((data as any).reason || "Send failed");
      }
      await supabase.from("contact_submissions").update({ status: "responded" }).eq("id", selectedContact.id);
      setContacts((prev) => prev.map((c) => (c.id === selectedContact.id ? { ...c, status: "responded" } : c)));
      setSelectedContact({ ...selectedContact, status: "responded" });
      setReplySubject("");
      setReplyMessage("");
      toast({ title: "Reply sent", description: `Email queued to ${selectedContact.email}. Replies will arrive at ${ADMIN_REPLY_TO}.` });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to send reply", variant: "destructive" });
    } finally {
      setIsSendingReply(false);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setSelectedContact(null);
      toast({ title: "Success", description: "Contact deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete contact", variant: "destructive" });
    }
  };

  // Chat functions
  const fetchConversations = async () => {
    setIsLoadingChats(true);
    try {
      const { data, error } = await supabase.from("chat_conversations").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      setConversations((data || []) as ChatConversation[]);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load conversations", variant: "destructive" });
    } finally {
      setIsLoadingChats(false);
    }
  };

  const fetchChatMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setChatMessages((data || []) as ChatMessage[]);
      
      // Mark messages as read
      await supabase
        .from("chat_messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .eq("sender_type", "visitor");
    } catch (error) {
      import.meta.env.DEV && console.error("Error fetching messages:", error);
    }
  };

  const subscribeToChatMessages = (conversationId: string) => {
    const channel = supabase
      .channel(`admin-chat-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setChatMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendChatMessage = async () => {
    if (!newChatMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabase.from("chat_messages").insert({
        conversation_id: selectedConversation.id,
        sender_type: "admin",
        message: newChatMessage,
        is_read: true,
      });
      if (error) throw error;
      setNewChatMessage("");
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
  };

  const closeConversation = async (id: string) => {
    try {
      const { error } = await supabase.from("chat_conversations").update({ status: "closed" }).eq("id", id);
      if (error) throw error;
      setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, status: "closed" } : c)));
      toast({ title: "Success", description: "Conversation closed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to close conversation", variant: "destructive" });
    }
  };

  const clearConversation = async (id: string) => {
    if (!confirm("Delete all messages in this conversation? This cannot be undone.")) return;
    try {
      const { error } = await supabase.from("chat_messages").delete().eq("conversation_id", id);
      if (error) throw error;
      setChatMessages([]);
      toast({ title: "Cleared", description: "All messages removed from this conversation." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to clear chat", variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirecting to /auth — render nothing to avoid flash
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-3">Admin sign-in required</h1>
          <p className="text-muted-foreground mb-6">
            You're signed in as <span className="text-foreground font-medium">{user.email}</span>, but this account doesn't have admin access yet. Sign in with the admin email to continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={async () => { await signOut(); navigate("/auth"); }}
              className="gradient-gold text-primary-foreground font-semibold"
            >
              Sign in as admin
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" className="glass">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const filteredReviews = reviews.filter((r) => filterStatus === "all" || r.status === filterStatus);
  const filteredPosts = posts.filter((p) => blogFilter === "all" || p.status === blogFilter);
  const filteredContacts = contacts.filter((c) => contactFilter === "all" || c.status === contactFilter);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Site
            </Button>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="analytics" className="space-y-8">
          <TabsList className="glass flex-wrap h-auto">
            <TabsTrigger value="analytics" className="data-[state=active]:gradient-gold">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:gradient-gold">
              <Star className="w-4 h-4 mr-2" />
              Reviews
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/10">{reviews.length}</span>
            </TabsTrigger>
            <TabsTrigger value="audits" className="data-[state=active]:gradient-gold">
              <ClipboardList className="w-4 h-4 mr-2" />
              System Audits
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/10">
                {contacts.filter((c: any) => c.lead_type === "system_audit").length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:gradient-gold">
              <FileText className="w-4 h-4 mr-2" />
              Blog
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/10">{posts.length}</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:gradient-gold">
              <Users className="w-4 h-4 mr-2" />
              Contacts
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/10">{contacts.filter(c => c.status === "new").length}</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:gradient-gold">
              <MessageSquare className="w-4 h-4 mr-2" />
              Live Chat
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/10">
                {conversations.filter(c => c.status === "active").length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsAdmin />
          </TabsContent>

          {/* System Audits Tab */}
          <TabsContent value="audits" className="space-y-6">
            <SystemAuditAdmin />
          </TabsContent>


          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {(["all", "pending", "approved", "rejected"] as FilterStatus[]).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  className={filterStatus === status ? "gradient-gold" : "glass"}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/10">
                    {status === "all" ? reviews.length : reviews.filter((r) => r.status === status).length}
                  </span>
                </Button>
              ))}
              <Button variant="outline" onClick={fetchReviews} className="glass ml-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {isLoadingReviews ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-muted-foreground">No reviews found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <motion.div key={review.id} layout className="glass rounded-xl p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.star_rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                            ))}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            review.status === "approved" ? "bg-green-500/20 text-green-400" :
                            review.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {review.status}
                          </span>
                          {review.is_featured && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">Featured</span>
                          )}
                        </div>
                        <h3 className="font-semibold">{review.name}</h3>
                        {review.company && <p className="text-sm text-muted-foreground">{review.company}</p>}
                        <p className="mt-2 text-foreground/80">{review.message}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{review.email}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap lg:flex-col gap-2">
                        {review.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => updateReviewStatus(review.id, "approved")} className="bg-green-600 hover:bg-green-700">
                              <Check className="w-4 h-4 mr-1" />Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => updateReviewStatus(review.id, "rejected")}>
                              <X className="w-4 h-4 mr-1" />Reject
                            </Button>
                          </>
                        )}
                        {review.status === "approved" && (
                          <Button size="sm" variant="outline" onClick={() => toggleFeatured(review.id, review.is_featured)} className="glass">
                            <Award className="w-4 h-4 mr-1" />{review.is_featured ? "Unfeature" : "Feature"}
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => startEditingReview(review)} className="glass">
                          <Edit2 className="w-4 h-4 mr-1" />Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="glass"><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Review</AlertDialogTitle>
                              <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="glass">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteReview(review.id)} className="bg-destructive">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {(["all", "draft", "published"] as BlogFilter[]).map((status) => (
                <Button
                  key={status}
                  variant={blogFilter === status ? "default" : "outline"}
                  onClick={() => setBlogFilter(status)}
                  className={blogFilter === status ? "gradient-gold" : "glass"}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
              <Button
                onClick={backfillMissingCovers}
                disabled={isBackfilling}
                variant="outline"
                className="glass ml-auto"
                title="Generate AI cover images for any published posts that don't have one yet"
              >
                {isBackfilling ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isBackfilling ? "Generating…" : "Backfill missing covers"}
              </Button>
              <Button
                onClick={() => {
                  if (window.confirm("Regenerate AI covers for ALL posts? This replaces every existing cover image.")) {
                    regenerateAllCovers();
                  }
                }}
                disabled={isBackfilling}
                variant="outline"
                className="glass"
                title="Regenerate fresh AI cover images for every blog post (replaces existing covers)"
              >
                {isBackfilling ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isBackfilling ? "Generating…" : "Regenerate all covers"}
              </Button>
              <Button
                onClick={() => {
                  if (window.confirm("Polish punctuation, grammar, and readability for ALL posts? This rewrites copy in place (meaning preserved).")) {
                    polishAllPosts();
                  }
                }}
                disabled={isPolishing || isBackfilling}
                variant="outline"
                className="glass"
                title="Use AI to fix punctuation, spacing, and AI-sounding phrases across every blog post"
              >
                {isPolishing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isPolishing ? "Polishing…" : "Polish all copy"}
              </Button>
              <Button
                onClick={() => {
                  setEditingPost(null);
                  setPostForm({ title: "", slug: "", excerpt: "", content: "", cover_image_url: "", author_name: "Admin", status: "draft" });
                }}
                className="gradient-gold"
              >
                <Plus className="w-4 h-4 mr-2" />New Post
              </Button>
            </div>

            {/* Post Editor */}
            {(editingPost || postForm.title) && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold">{editingPost ? "Edit Post" : "New Post"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={postForm.title}
                      onChange={(e) => setPostForm((prev) => ({ ...prev, title: e.target.value, slug: createSlug(e.target.value) }))}
                      className="glass border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input value={postForm.slug} onChange={(e) => setPostForm((prev) => ({ ...prev, slug: e.target.value }))} className="glass border-white/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label>Cover Image</Label>
                    <Button
                      type="button"
                      onClick={generateCoverImage}
                      disabled={isGeneratingCover}
                      variant="outline"
                      size="sm"
                      className="glass"
                    >
                      {isGeneratingCover ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      {isGeneratingCover ? "Generating…" : "Generate with AI"}
                    </Button>
                  </div>
                  <Input
                    value={postForm.cover_image_url}
                    onChange={(e) => setPostForm((prev) => ({ ...prev, cover_image_url: e.target.value }))}
                    placeholder="https://… or click Generate with AI"
                    className="glass border-white/10"
                  />
                  {postForm.cover_image_url ? (
                    <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-white/10 max-w-md">
                      <img src={postForm.cover_image_url} alt="Cover preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Leave empty to auto-generate a fitting AI cover on save.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Excerpt</Label>
                  <Textarea
                    value={postForm.excerpt}
                    onChange={(e) => setPostForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                    rows={2}
                    className="glass border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content (HTML supported)</Label>
                  <Textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm((prev) => ({ ...prev, content: e.target.value }))}
                    rows={10}
                    className="glass border-white/10"
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => { setPostForm((prev) => ({ ...prev, status: "draft" })); savePost(); }} variant="outline" className="glass">
                    Save as Draft
                  </Button>
                  <Button onClick={() => { setPostForm((prev) => ({ ...prev, status: "published" })); savePost(); }} className="gradient-gold">
                    Publish
                  </Button>
                  <Button onClick={() => { setEditingPost(null); setPostForm({ title: "", slug: "", excerpt: "", content: "", cover_image_url: "", author_name: "Admin", status: "draft" }); }} variant="ghost">
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Posts List */}
            {isLoadingPosts ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-muted-foreground">No posts found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <motion.div key={post.id} layout className="glass rounded-xl p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            post.status === "published" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {post.status}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        {post.excerpt && <p className="text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(post.created_at).toLocaleDateString()} • {post.author_name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEditingPost(post)} className="glass">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="glass"><Trash2 className="w-4 h-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Post</AlertDialogTitle>
                              <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="glass">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deletePost(post.id)} className="bg-destructive">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {(["all", "new", "read", "responded", "archived"] as ContactFilter[]).map((status) => (
                <Button
                  key={status}
                  variant={contactFilter === status ? "default" : "outline"}
                  onClick={() => setContactFilter(status)}
                  className={contactFilter === status ? "gradient-gold" : "glass"}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contact List */}
              <div className="lg:col-span-1 space-y-4">
                {isLoadingContacts ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="glass rounded-2xl p-6 text-center">
                    <p className="text-muted-foreground text-sm">No contacts found</p>
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      layout
                      onClick={() => { setSelectedContact(contact); setAdminNotes(contact.admin_notes || ""); setReplySubject(`Re: ${contact.service || "your message"}`); setReplyMessage(""); updateContactStatus(contact.id, "read"); }}
                      className={`glass rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-all ${selectedContact?.id === contact.id ? "border-primary/50" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{contact.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          contact.status === "new" ? "bg-blue-500/20 text-blue-400" :
                          contact.status === "read" ? "bg-yellow-500/20 text-yellow-400" :
                          contact.status === "responded" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {contact.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.service}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(contact.created_at).toLocaleDateString()}</p>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Contact Detail */}
              <div className="lg:col-span-2">
                {selectedContact ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6 space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{selectedContact.name}</h3>
                        {selectedContact.company && <p className="text-muted-foreground">{selectedContact.company}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => updateContactStatus(selectedContact.id, "responded")} className="glass">
                          <Check className="w-4 h-4 mr-1" />Responded
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateContactStatus(selectedContact.id, "archived")} className="glass">
                          <Archive className="w-4 h-4 mr-1" />Archive
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="glass"><Trash2 className="w-4 h-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                              <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="glass">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteContact(selectedContact.id)} className="bg-destructive">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-muted-foreground">Email:</span> <a href={`mailto:${selectedContact.email}`} className="text-primary">{selectedContact.email}</a></div>
                      {selectedContact.phone && <div><span className="text-muted-foreground">Phone:</span> {selectedContact.phone}</div>}
                      <div><span className="text-muted-foreground">Service:</span> {selectedContact.service}</div>
                      {selectedContact.budget_range && <div><span className="text-muted-foreground">Budget:</span> {selectedContact.budget_range}</div>}
                      {selectedContact.custom_budget && <div className="col-span-2"><span className="text-muted-foreground">Custom Budget:</span> {selectedContact.custom_budget}</div>}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Message</h4>
                      <p className="text-foreground/80 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Admin Notes</h4>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add notes about this contact..."
                        rows={3}
                        className="glass border-white/10"
                      />
                      <Button onClick={saveContactNotes} size="sm" className="gradient-gold">Save Notes</Button>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center gap-2"><Send className="w-4 h-4" /> Reply via Email</h4>
                        <span className="text-xs text-muted-foreground">From: TheHeroes Agency · Replies → {ADMIN_REPLY_TO}</span>
                      </div>
                      <Input
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        placeholder="Subject"
                        maxLength={200}
                        className="glass border-white/10"
                      />
                      <Textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder={`Hi ${selectedContact.name.split(" ")[0] || "there"},\n\nThanks for reaching out...`}
                        rows={6}
                        maxLength={5000}
                        className="glass border-white/10"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{replyMessage.length}/5000</span>
                        <Button onClick={sendReply} disabled={isSendingReply} size="sm" className="gradient-gold">
                          {isSendingReply ? "Sending..." : (<><Send className="w-4 h-4 mr-1" />Send Reply</>)}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-muted-foreground">Select a contact to view details</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              {/* Conversation List */}
              <div className="lg:col-span-1 glass rounded-2xl p-4 overflow-y-auto">
                <h3 className="font-bold mb-4">Conversations</h3>
                {isLoadingChats ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                  </div>
                ) : conversations.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">No conversations yet</p>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`p-3 rounded-xl cursor-pointer transition-all ${
                          selectedConversation?.id === conv.id ? "bg-primary/20 border border-primary/30" : "hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{conv.visitor_name || "Anonymous"}</span>
                          <span className={`w-2 h-2 rounded-full ${conv.status === "active" ? "bg-green-500" : "bg-gray-500"}`} />
                        </div>
                        {conv.visitor_email && <p className="text-xs text-muted-foreground">{conv.visitor_email}</p>}
                        <p className="text-xs text-muted-foreground mt-1">{new Date(conv.updated_at).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Window */}
              <div className="lg:col-span-2 glass rounded-2xl flex flex-col overflow-hidden">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">{selectedConversation.visitor_name || "Anonymous"}</h3>
                        {selectedConversation.visitor_email && (
                          <p className="text-sm text-muted-foreground">{selectedConversation.visitor_email}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => clearConversation(selectedConversation.id)}
                          className="glass"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />Clear
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => closeConversation(selectedConversation.id)}
                          disabled={selectedConversation.status === "closed"}
                          className="glass"
                        >
                          <X className="w-4 h-4 mr-1" />Close
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender_type === "admin" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                              msg.sender_type === "admin"
                                ? "gradient-gold text-primary-foreground rounded-br-sm"
                                : "bg-white/10 rounded-bl-sm"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.sender_type === "admin" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={newChatMessage}
                          onChange={(e) => setNewChatMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                          className="glass border-white/10 flex-1"
                          disabled={selectedConversation.status === "closed"}
                        />
                        <Button onClick={sendChatMessage} disabled={!newChatMessage.trim() || selectedConversation.status === "closed"} className="gradient-gold">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Select a conversation to start chatting</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Review Edit Modal */}
      <AnimatePresence>
        {editingReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setEditingReview(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass rounded-2xl p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Edit Review</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="glass border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-company">Company</Label>
                  <Input
                    id="edit-company"
                    value={editForm.company}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, company: e.target.value }))}
                    className="glass border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-message">Message</Label>
                  <Textarea
                    id="edit-message"
                    value={editForm.message}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="glass border-white/10"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="ghost" onClick={() => setEditingReview(null)}>Cancel</Button>
                <Button onClick={saveReviewEdit} className="gradient-gold">Save Changes</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
