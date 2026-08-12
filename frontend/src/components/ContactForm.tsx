import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { contactService } from "@/services/contactService";
import { getApiErrorMessage } from "@/services/api";
import { useToast } from "@/context/ToastContext";

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email address."),
  subject: z.string().min(2, "Please enter a subject."),
  message: z.string().min(10, "Message should be at least 10 characters."),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await contactService.submit(data);
      showToast("Your message has been sent. We'll get back to you soon.", "success");
      reset();
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-slate-400">Your Name</label>
        <input id="name" {...register("name")} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-violet-glow/50 focus:outline-none" placeholder="Full name" />
        {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-400">Your Email</label>
        <input id="email" type="email" {...register("email")} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-violet-glow/50 focus:outline-none" placeholder="you@example.com" />
        {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-xs font-medium text-slate-400">Subject</label>
        <input id="subject" {...register("subject")} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-violet-glow/50 focus:outline-none" placeholder="What's this about?" />
        {errors.subject && <p className="mt-1 text-xs text-rose-400">{errors.subject.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-slate-400">Message</label>
        <textarea id="message" rows={4} {...register("message")} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-violet-glow/50 focus:outline-none" placeholder="Tell us what's on your mind" />
        {errors.message && <p className="mt-1 text-xs text-rose-400">{errors.message.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? "Sending..." : "Send Message"} <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
