import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type FilterStatus = "all" | "pending" | "approved" | "rejected";

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin, signOut } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ name: "", company: "", message: "" });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchReviews();
    }
  }, [user, isAdmin, filterStatus]);

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      let query = supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const updateReviewStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );

      toast({
        title: "Success",
        description: `Review ${status}`,
      });
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ is_featured: !isFeatured })
        .eq("id", id);

      if (error) throw error;

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_featured: !isFeatured } : r))
      );

      toast({
        title: "Success",
        description: isFeatured ? "Removed from featured" : "Added to featured",
      });
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
      });
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) throw error;

      setReviews((prev) => prev.filter((r) => r.id !== id));

      toast({
        title: "Success",
        description: "Review deleted",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const startEditing = (review: Review) => {
    setEditingReview(review);
    setEditForm({
      name: review.name,
      company: review.company || "",
      message: review.message,
    });
  };

  const saveEdit = async () => {
    if (!editingReview) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          name: editForm.name,
          company: editForm.company || null,
          message: editForm.message,
        })
        .eq("id", editingReview.id);

      if (error) throw error;

      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id
            ? { ...r, ...editForm, company: editForm.company || null }
            : r
        )
      );

      setEditingReview(null);
      toast({
        title: "Success",
        description: "Review updated",
      });
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
      });
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin panel.
          </p>
          <Button onClick={() => navigate("/")} variant="outline" className="glass">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const statusCounts = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Site
            </Button>
            <h1 className="text-xl font-bold">Review Management</h1>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["all", "pending", "approved", "rejected"] as FilterStatus[]).map(
            (status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                onClick={() => setFilterStatus(status)}
                className={filterStatus === status ? "gradient-gold" : "glass"}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/10">
                  {statusCounts[status]}
                </span>
              </Button>
            )
          )}
          <Button
            variant="outline"
            onClick={fetchReviews}
            className="glass ml-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Reviews List */}
        {isLoadingReviews ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass rounded-xl p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {/* Stars */}
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.star_rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            review.status === "approved"
                              ? "bg-green-500/20 text-green-400"
                              : review.status === "rejected"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {review.status}
                        </span>
                        {review.is_featured && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold">{review.name}</h3>
                      {review.company && (
                        <p className="text-sm text-muted-foreground">
                          {review.company}
                        </p>
                      )}

                      <p className="mt-2 text-foreground/80">{review.message}</p>

                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {review.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap lg:flex-col gap-2">
                      {review.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateReviewStatus(review.id, "approved")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateReviewStatus(review.id, "rejected")}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}

                      {review.status === "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            toggleFeatured(review.id, review.is_featured)
                          }
                          className="glass"
                        >
                          <Award className="w-4 h-4 mr-1" />
                          {review.is_featured ? "Unfeature" : "Feature"}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(review)}
                        className="glass"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="glass">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="glass border-white/10">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Review</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this review? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="glass">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteReview(review.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Edit Modal */}
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
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="glass border-white/10"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-company">Company</Label>
                  <Input
                    id="edit-company"
                    value={editForm.company}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, company: e.target.value }))
                    }
                    className="glass border-white/10"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-message">Review</Label>
                  <Textarea
                    id="edit-message"
                    value={editForm.message}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, message: e.target.value }))
                    }
                    rows={4}
                    className="glass border-white/10 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setEditingReview(null)}
                  className="glass flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={saveEdit} className="gradient-gold flex-1">
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
