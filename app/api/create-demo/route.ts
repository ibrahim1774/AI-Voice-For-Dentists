import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DENTAL_KNOWLEDGE = {
  primaryGoal: "Book a patient appointment",
  keyInfo:
    "New patient or existing, insurance provider and member ID, reason for visit (cleaning, checkup, toothache, cosmetic consultation, emergency), preferred date/time, any urgency or pain level",
  scenarios:
    "New patient wanting to book (cleaning, comprehensive exam), existing patient needing follow-up or routine cleaning, insurance verification questions, emergency/urgent visits (toothache, broken tooth, swelling), cosmetic consultations (whitening, veneers, Invisalign), cancellation or rescheduling requests",
  pricingBehavior:
    'Say "we accept most major dental insurance plans — our front desk team will verify your specific coverage and any copay before your visit"',
  schedulingNotes:
    "Differentiate between new patient appointments (longer slots for X-rays and comprehensive exam) and existing patient visits (routine cleanings, follow-ups), ask about morning or afternoon preference",
};

interface CreateDemoRequest {
  practiceName: string;
  phoneNumber: string;
  goal: string;
  voiceGender?: "female" | "male";
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateDemoRequest = await request.json();

    // Validate input
    if (!body.practiceName?.trim()) {
      return NextResponse.json(
        { error: "Practice name is required" },
        { status: 400 }
      );
    }

    const phoneDigits = (body.phoneNumber || "").replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { error: "A valid phone number is required" },
        { status: 400 }
      );
    }

    if (!body.goal?.trim()) {
      return NextResponse.json(
        { error: "Please select a goal" },
        { status: 400 }
      );
    }

    const goal = body.goal;

    const voiceId = body.voiceGender === "male"
      ? "iP95p4xoKVk53GoZ742B"
      : "paula";

    // Step 1: Generate custom dental receptionist system prompt with Claude
    const claudeResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are an expert at creating AI receptionist system prompts for dental practices. Generate a custom system prompt for this dental practice:

Dental Practice Name: "${body.practiceName}"
Goal: "${goal}"

This receptionist answers phone calls for this dental practice. The practice's #1 goal for their AI receptionist is: ${goal}. Here is what you need to know:

Primary goal: ${DENTAL_KNOWLEDGE.primaryGoal}
Information to gather from callers: ${DENTAL_KNOWLEDGE.keyInfo}
Common caller scenarios to handle: ${DENTAL_KNOWLEDGE.scenarios}
How to handle pricing questions: ${DENTAL_KNOWLEDGE.pricingBehavior}
Scheduling notes: ${DENTAL_KNOWLEDGE.schedulingNotes}

The system prompt you generate must:

1. Greet callers warmly using the practice name: "${body.practiceName}"
2. Sound like a real human dental receptionist — use contractions, casual phrasing, and a friendly, reassuring tone
3. Follow the dental-specific booking flow above — ask the right questions in a natural conversational order, not all at once
4. Ask ONE question at a time, wait for the answer, then ask the next
5. Always work toward the primary goal: booking an appointment — prioritize this above all else in every conversation
6. Handle the common dental scenarios listed above naturally — be especially empathetic with patients in pain or dental emergencies
7. Use the pricing guidance above when pricing comes up — never make up specific prices
8. Keep every response to 1-3 sentences max — this is a phone call, not an email
9. If the caller asks something outside your knowledge, say "Let me have someone from our team get back to you on that — can I grab your name and number?"
10. Always capture the caller's name and callback number before ending the call
11. Never mention being AI unless directly asked
12. Never fabricate information about the practice — don't make up dentist names, office hours, or specific services not mentioned
13. Match the caller's energy level — if they're upbeat, be upbeat; if they're concerned, be calm and reassuring
14. Use natural filler words occasionally (like "sure," "absolutely," "of course," "great") to sound more human
15. Inject light, appropriate wit when the conversation allows — keep it warm and professional
16. Show genuine enthusiasm when a patient wants to book or is interested in a service
17. Use emotion tags like [warm], [reassuring], [enthusiastic] in appropriate places to guide vocal delivery

Return ONLY the system prompt text. No markdown formatting, no explanations, no quotation marks wrapping it.`,
        },
      ],
    });

    const systemPrompt =
      claudeResponse.content[0].type === "text"
        ? claudeResponse.content[0].text
        : "";

    if (!systemPrompt) {
      throw new Error("Failed to generate system prompt");
    }

    // Step 2: Create Vapi assistant with the custom dental prompt
    const vapiResponse = await fetch("https://api.vapi.ai/assistant", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Demo - ${body.practiceName}`.slice(0, 40),
        model: {
          provider: "anthropic",
          model: "claude-sonnet-4-5-20250929",
          systemPrompt: systemPrompt,
          temperature: 0.7,
          maxTokens: 300,
        },
        voice: {
          provider: "11labs",
          voiceId: voiceId,
          stability: 0.25,
          similarityBoost: 0.88,
          style: 0.8,
          useSpeakerBoost: true,
          model: "eleven_turbo_v2_5",
        },
        transcriber: {
          provider: "deepgram",
          model: "nova-3",
          language: "en-US",
          smartFormat: true,
          endpointing: 300,
          confidenceThreshold: 0.4,
          keywords: [
            // Core dental terms
            "dental:5",
            "dentist:5",
            "cleaning:5",
            "checkup:5",
            "toothache:5",
            "cavity:5",
            "filling:5",
            "crown:5",
            "root:5",
            "canal:5",
            "extraction:5",
            "Invisalign:5",
            "veneers:5",
            "whitening:5",
            "braces:5",
            "orthodontics:5",
            "periodontal:5",
            "gingivitis:5",
            "implant:5",
            "dentures:5",
            "xray:5",
            "fluoride:5",
            "hygienist:5",
            // Scheduling terms
            "appointment:5",
            "schedule:5",
            "reschedule:5",
            "cancellation:5",
            // Tooth & condition terms
            "abscess:5",
            "molar:5",
            "bicuspid:5",
            "incisor:5",
            "plaque:5",
            "tartar:5",
            "sensitivity:5",
            "swelling:5",
            "bleeding:5",
            // Materials & procedures
            "porcelain:5",
            "composite:5",
            "amalgam:5",
            "sedation:5",
            "novocaine:5",
            "anesthesia:5",
            "prophylaxis:5",
            "occlusion:5",
            "endodontic:5",
            "prosthodontic:5",
            // X-ray types
            "panoramic:5",
            "bitewing:5",
            // Insurance
            "copay:5",
            "PPO:5",
            "HMO:5",
            "delta:5",
            "Cigna:5",
            "Aetna:5",
            "MetLife:5",
            "Guardian:5",
            "Humana:5",
            "BlueCross:5",
          ],
          keyterm: [
            "root canal",
            "dental implant",
            "wisdom tooth",
            "deep cleaning",
            "dental crown",
            "dental bridge",
            "gum disease",
            "new patient",
            "existing patient",
            "Delta Dental",
            "United Concordia",
            "Blue Cross Blue Shield",
            "member ID",
            "insurance verification",
          ],
        },
        backgroundSpeechDenoisingPlan: {
          smartDenoisingPlan: { enabled: true },
        },
        firstMessage: `Thanks for calling ${body.practiceName}, how can I help you today?`,
        firstMessageMode: "assistant-speaks-first",
      }),
    });

    if (!vapiResponse.ok) {
      const vapiError = await vapiResponse.json().catch(() => ({}));
      console.error("Vapi API error:", vapiError);
      const errorMessage = vapiError?.message || vapiError?.error || JSON.stringify(vapiError);
      throw new Error(`Failed to create AI assistant: ${errorMessage}`);
    }

    const assistant = await vapiResponse.json();

    return NextResponse.json({
      assistantId: assistant.id,
      practiceName: body.practiceName,
    });
  } catch (error) {
    console.error("Create demo error:", error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error: `AI service error: ${error.message}`,
        },
        { status: error.status || 503 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "We hit a snag building your receptionist. Please try again.",
      },
      { status: 500 }
    );
  }
}
