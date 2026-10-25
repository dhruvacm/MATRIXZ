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
        <label htmlFor="name" className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#202923]">
          Full Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="w-full rounded-md border border-[#E1E4DC] bg-white px-3.5 py-2.5 text-sm text-[#202923] placeholder:text-[#95A198] shadow-subtle transition-all focus:border-[#214E3D] focus:outline-none focus:ring-1 focus:ring-[#214E3D]"
          placeholder="e.g. Alex Morgan"
        />
        {errors.name && <p className="mt-1 font-mono text-[11px] text-rose-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#202923]">
          Institutional / Personal Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full rounded-md border border-[#E1E4DC] bg-white px-3.5 py-2.5 text-sm text-[#202923] placeholder:text-[#95A198] shadow-subtle transition-all focus:border-[#214E3D] focus:outline-none focus:ring-1 focus:ring-[#214E3D]"
          placeholder="alex@college.edu"
        />
        {errors.email && <p className="mt-1 font-mono text-[11px] text-rose-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="subject" className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#202923]">
          Subject
        </label>
        <input
          id="subject"
          {...register("subject")}
          className="w-full rounded-md border border-[#E1E4DC] bg-white px-3.5 py-2.5 text-sm text-[#202923] placeholder:text-[#95A198] shadow-subtle transition-all focus:border-[#214E3D] focus:outline-none focus:ring-1 focus:ring-[#214E3D]"
          placeholder="Topic of inquiry"
        />
        {errors.subject && <p className="mt-1 font-mono text-[11px] text-rose-600">{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#202923]">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          {...register("message")}
          className="w-full resize-none rounded-md border border-[#E1E4DC] bg-white px-3.5 py-2.5 text-sm text-[#202923] placeholder:text-[#95A198] shadow-subtle transition-all focus:border-[#214E3D] focus:outline-none focus:ring-1 focus:ring-[#214E3D]"
          placeholder="Provide context or details..."
        />
        {errors.message && <p className="mt-1 font-mono text-[11px] text-rose-600">{errors.message.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm font-semibold">
        {isSubmitting ? "Transmitting..." : "Send Message"} <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
