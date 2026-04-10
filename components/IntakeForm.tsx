"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";

const INDUSTRIES = [
  "General Dentistry",
  "Cosmetic",
  "Orthodontics",
  "Pediatric",
  "Implants",
  "Emergency Dental",
  "Oral Surgery",
  "Periodontics",
];

interface FormData {
  practiceName: string;
  phoneNumber: string;
  industry: string;
  voiceGender: "female" | "male";
}

interface FormErrors {
  practiceName?: string;
  phoneNumber?: string;
  industry?: string;
}

const MINIMUM_LOADING_TIME = 4500;

export default function IntakeForm() {
  const router = useRouter();
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [industryFocused, setIndustryFocused] = useState(false);

  useEffect(() => {
    const params: Record<string, string> = {};
    const url = new URL(window.location.href);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];
    keys.forEach((key) => {
      const val = url.searchParams.get(key);
      if (val) params[key] = val;
    });
    setUtmParams(params);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % INDUSTRIES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const [formData, setFormData] = useState<FormData>({
    practiceName: "",
    phoneNumber: "",
    industry: "",
    voiceGender: "female",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.practiceName.trim()) {
      newErrors.practiceName = "Practice name is required";
    }

    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      newErrors.phoneNumber = "Enter a valid phone number";
    }

    if (!formData.industry.trim()) {
      newErrors.industry = "Please enter your industry";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      const [response] = await Promise.all([
        fetch("/api/create-demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }),
        fetch("https://hook.us2.make.com/grfdvnf6covrw9ptif6rwl4kef9kp3hv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName: formData.practiceName,
            phoneNumber: formData.phoneNumber,
            industry: formData.industry,
            voiceGender: formData.voiceGender,
            ...utmParams,
          }),
        }).catch(() => {}),
        new Promise((resolve) => setTimeout(resolve, MINIMUM_LOADING_TIME)),
      ]);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "We hit a snag building your receptionist. Please try again."
        );
      }

      const data = await response.json();
      router.push(
        `/demo?assistantId=${data.assistantId}&practiceName=${encodeURIComponent(data.practiceName)}`
      );
    } catch (err) {
      setIsLoading(false);
      setApiError(
        err instanceof Error
          ? err.message
          : "We hit a snag building your receptionist. Please try again."
      );
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-sans text-sm text-foreground placeholder:text-subtle focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all duration-300";

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />

      <div className="gold-glow-border mx-auto max-w-lg rounded-2xl p-6 md:p-8 transition-all duration-500">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-4 text-left">
          {/* Practice Name */}
          <div>
            <input
              type="text"
              name="practiceName"
              placeholder="Your Dental Practice Name"
              value={formData.practiceName}
              onChange={handleChange}
              className={inputClasses}
              autoComplete="organization"
            />
            {errors.practiceName && (
              <p className="mt-1.5 text-sm text-red-500 font-sans">
                {errors.practiceName}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Your Mobile Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={inputClasses}
              autoComplete="tel"
            />
            {errors.phoneNumber && (
              <p className="mt-1.5 text-sm text-red-500 font-sans">
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Industry */}
          <div>
            <input
              type="text"
              name="industry"
              placeholder={industryFocused ? "" : INDUSTRIES[placeholderIndex]}
              value={formData.industry}
              onChange={handleChange}
              onFocus={() => setIndustryFocused(true)}
              onBlur={() => setIndustryFocused(false)}
              className={inputClasses}
              autoComplete="off"
            />
            {errors.industry && (
              <p className="mt-1.5 text-sm text-red-500 font-sans">
                {errors.industry}
              </p>
            )}
          </div>

          {/* Voice Gender Toggle */}
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, voiceGender: "female" }))}
              className={`rounded-full px-5 py-2 font-sans text-sm font-medium transition-all duration-300 ${
                formData.voiceGender === "female"
                  ? "bg-gold text-white"
                  : "border border-slate-200 bg-white text-foreground"
              }`}
            >
              Female Voice
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, voiceGender: "male" }))}
              className={`rounded-full px-5 py-2 font-sans text-sm font-medium transition-all duration-300 ${
                formData.voiceGender === "male"
                  ? "bg-gold text-white"
                  : "border border-slate-200 bg-white text-foreground"
              }`}
            >
              Male Voice
            </button>
          </div>

          {apiError && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600 font-sans">{apiError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gold px-6 py-3.5 font-sans text-sm font-semibold text-white transition-all duration-300 hover:bg-gold-light hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            HEAR MY LIVE DEMO &rarr;
          </button>

          <p className="text-center font-sans text-xs text-muted">
            Free. No commitment. Just listen.
          </p>
        </form>
      </div>
    </>
  );
}
