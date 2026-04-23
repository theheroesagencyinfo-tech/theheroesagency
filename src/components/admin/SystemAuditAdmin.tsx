import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  RefreshCw,
  ExternalLink,
  Mail,
  Calendar,
  Globe,
  Target,
  TrendingUp,
  UserCog,
  Trash2,
  Check,
  Archive,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "@/hooks/use-toast";

interface AuditLead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  website_url: string | null;
  store_type: string | null;
  goals: string | null;
  budget_range: string | null;
  message: string;
  status: string;
  admin_notes: string | null;
  assigned_reviewer_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  landing_page: string | null;
  created_at: string;
}

interface Reviewer {
  user_id: string;
  email?: string | null;
}

type Filter = "all" | "new" | "assigned" | "responded" | "archived";

export function SystemAuditAdmin() {
  const [leads, setLeads] = useState<AuditLead[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<AuditLead | null>(null);
  const [notes, setNotes] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .eq("lead_type", "system_audit")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load audit requests",
        variant: "destructive",
      });
    } else {
      setLeads((data || []) as AuditLead[]);
    }
    setLoading(false);
  };

  const fetchReviewers = async () => {
    // Reviewers = anyone with the admin role
    const { data, error } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
    if (error) return;
    setReviewers((data || []).map((r) => ({ user_id: r.user_id })));
  };

  useEffect(() => {
    fetchLeads();
    fetchReviewers();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return leads;
    if (filter === "assigned") return leads.filter((l) => l.assigned_reviewer_id);
    return leads.filter((l) => l.status === filter);
  }, [leads, filter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const assignReviewer = async (id: string, reviewerId: string | null) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ assigned_reviewer_id: reviewerId })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to assign reviewer", variant: "destructive" });
      return;
    }
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, assigned_reviewer_id: reviewerId } : l))
    );
    if (selected?.id === id) setSelected({ ...selected, assigned_reviewer_id: reviewerId });
    toast({ title: "Saved", description: reviewerId ? "Reviewer assigned" : "Reviewer cleared" });
  };

  const saveNotes = async () => {
    if (!selected) return;
    const { error } = await supabase
      .from("contact_submissions")
      .update({ admin_notes: notes })
      .eq("id", selected.id);
    if (error) {
      toast({ title: "Error", description: "Failed to save notes", variant: "destructive" });
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === selected.id ? { ...l, admin_notes: notes } : l)));
    toast({ title: "Saved", description: "Notes updated" });
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
      return;
    }
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelected(null);
    toast({ title: "Deleted", description: "Audit request removed" });
  };

  const select = (lead: AuditLead) => {
    setSelected(lead);
    setNotes(lead.admin_notes || "");
    if (lead.status === "new") updateStatus(lead.id, "read");
  };

  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "new", "assigned", "responded", "archived"] as Filter[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            className={filter === f ? "gradient-gold" : "glass"}
            size="sm"
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "new" && newCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-white/20">
                {newCount}
              </span>
            )}
          </Button>
        ))}
        <Button variant="outline" onClick={fetchLeads} className="glass ml-auto" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-center">
              <ClipboardList className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No audit requests</p>
            </div>
          ) : (
            filtered.map((lead) => (
              <motion.div
                key={lead.id}
                layout
                onClick={() => select(lead)}
                className={`glass rounded-xl p-4 cursor-pointer transition-all ${
                  selected?.id === lead.id
                    ? "border-primary/50 ring-1 ring-primary/30"
                    : "hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium truncate">{lead.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      lead.status === "new"
                        ? "bg-blue-500/20 text-blue-400"
                        : lead.status === "responded"
                        ? "bg-green-500/20 text-green-400"
                        : lead.status === "archived"
                        ? "bg-gray-500/20 text-gray-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
                {lead.website_url && (
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <Globe className="w-3 h-3 flex-shrink-0" />
                    {lead.website_url}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                  <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                  {lead.utm_source && (
                    <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      {lead.utm_source}
                    </span>
                  )}
                  {lead.assigned_reviewer_id && (
                    <span className="px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 flex items-center gap-1">
                      <UserCog className="w-2.5 h-2.5" />
                      assigned
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 space-y-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-sm text-primary inline-flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {selected.email}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(selected.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(selected.id, "responded")}
                    className="glass"
                  >
                    <Check className="w-4 h-4 mr-1" /> Responded
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(selected.id, "archived")}
                    className="glass"
                  >
                    <Archive className="w-4 h-4 mr-1" /> Archive
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="glass">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete audit request?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes the lead and cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="glass">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteLead(selected.id)}
                          className="bg-destructive"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Audit details */}
              <div className="grid sm:grid-cols-2 gap-4">
                {selected.website_url && (
                  <DetailCard icon={Globe} label="Website">
                    <a
                      href={
                        selected.website_url.startsWith("http")
                          ? selected.website_url
                          : `https://${selected.website_url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-1 break-all"
                    >
                      {selected.website_url}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </DetailCard>
                )}
                {selected.store_type && (
                  <DetailCard icon={Target} label="Store Type">
                    {selected.store_type}
                  </DetailCard>
                )}
                {selected.budget_range && (
                  <DetailCard icon={TrendingUp} label="Monthly Revenue">
                    {selected.budget_range}
                  </DetailCard>
                )}
              </div>

              {selected.goals && (
                <div>
                  <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                    Goals
                  </h4>
                  <p className="text-foreground/90 whitespace-pre-wrap text-sm leading-relaxed bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    {selected.goals}
                  </p>
                </div>
              )}

              {/* Reviewer */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  Assigned Reviewer
                </Label>
                <Select
                  value={selected.assigned_reviewer_id || "unassigned"}
                  onValueChange={(v) =>
                    assignReviewer(selected.id, v === "unassigned" ? null : v)
                  }
                >
                  <SelectTrigger className="glass border-white/10">
                    <SelectValue placeholder="Assign reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {reviewers.map((r) => (
                      <SelectItem key={r.user_id} value={r.user_id}>
                        {r.user_id.slice(0, 8)}…
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Traffic source */}
              {(selected.utm_source ||
                selected.utm_medium ||
                selected.utm_campaign ||
                selected.referrer ||
                selected.landing_page) && (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                    Traffic Source
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    {selected.utm_source && <KV k="Source" v={selected.utm_source} />}
                    {selected.utm_medium && <KV k="Medium" v={selected.utm_medium} />}
                    {selected.utm_campaign && <KV k="Campaign" v={selected.utm_campaign} />}
                    {selected.utm_term && <KV k="Term" v={selected.utm_term} />}
                    {selected.utm_content && <KV k="Content" v={selected.utm_content} />}
                    {selected.referrer && <KV k="Referrer" v={selected.referrer} />}
                    {selected.landing_page && (
                      <div className="sm:col-span-2">
                        <KV k="Landing Page" v={selected.landing_page} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  Internal Notes
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="glass border-white/10"
                  placeholder="Add internal notes about this audit..."
                />
                <Button onClick={saveNotes} size="sm" className="gradient-gold">
                  Save Notes
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center">
              <ClipboardList className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">Select an audit request to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="text-sm text-foreground/90">{children}</div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</span>
      <span className="text-foreground/90 break-all">{v}</span>
    </div>
  );
}
