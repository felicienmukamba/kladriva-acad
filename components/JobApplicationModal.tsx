"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { applyToJob } from "@/app/actions/jobs";
import { CheckCircle } from "lucide-react";

export function JobApplicationModal({ 
  jobId, 
  jobTitle, 
  companyName,
  userId 
}: { 
  jobId: string; 
  jobTitle: string; 
  companyName: string;
  userId: string;
}) {
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await applyToJob(jobId, userId, coverNote);
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setCoverNote("");
      }, 2000);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Apply Now
          </Button>
        }
      />
      <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[500px]">
        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold">Application Sent!</h3>
            <p className="text-slate-400">
              Your application for {jobTitle} has been submitted.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Apply for {jobTitle}</DialogTitle>
              <DialogDescription className="text-slate-400">
                You're applying to <span className="text-indigo-400 font-semibold">{companyName}</span>. 
                Your Kladriva profile and verified projects will be attached automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="coverNote" className="text-slate-300">
                  Cover Note (Optional)
                </Label>
                <Textarea 
                  id="coverNote"
                  placeholder="Tell the employer why you're a great fit..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[150px] focus:ring-indigo-500"
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isSubmitting ? "Sending..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
