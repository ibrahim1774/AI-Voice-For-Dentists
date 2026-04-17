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
  prompt: string;
}

interface ExtractedData {
  practiceName: string;
  voiceGender: "female" | "male";
  systemPrompt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateDemoRequest = await request.json();

    if (!body.prompt?.trim() || body.prompt.trim().length < 10) {
      return NextResponse.json(
        { error: "Please describe your practice and what you'd like your AI to do." },
        { status: 400 }
      );
    }

    const userPrompt = body.prompt.trim();

    // Single Claude call: extract practice name + voice gender + generate system prompt
    const claudeResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1536,
      messages: [
        {
          role: "user",
          content: `You are an expert at creating AI receptionist system prompts for dental practices. A dental practice owner has described their practice and what they want their AI receptionist to do. Your job is to:

1. Extract the practice name from their description (if not explicitly mentioned, create a reasonable default like "Your Dental Practice")
2. Detect voice gender preference if mentioned (male or female — default to female if not specified)
3. Generate a custom system prompt tailored to what they described

Here's what the practice owner wrote:
"""
${userPrompt}
"""

DENTAL CONTEXT (to inform the system prompt):
Primary goal: ${DENTAL_KNOWLEDGE.primaryGoal}
Information to gather from callers: ${DENTAL_KNOWLEDGE.keyInfo}
Common caller scenarios: ${DENTAL_KNOWLEDGE.scenarios}
Pricing guidance: ${DENTAL_KNOWLEDGE.pricingBehavior}
Scheduling notes: ${DENTAL_KNOWLEDGE.schedulingNotes}

SYSTEM PROMPT REQUIREMENTS:
1. Greet callers warmly using the practice name
2. Sound like a real human dental receptionist — use contractions, casual phrasing, warm tone
3. Follow the dental booking flow — ask ONE question at a time in natural conversational order
4. Always work toward the primary goal: booking the appointment
5. Handle dental scenarios naturally — be especially empathetic with pain/emergency patients
6. Never make up specific prices — use the pricing guidance
7. Keep every response to 1-3 sentences max (this is a phone call)
8. If caller asks something outside knowledge, offer to have a team member call back
9. Always capture caller's name and callback number before ending
10. Never mention being AI unless directly asked
11. Use natural filler words ("sure", "absolutely", "of course") sparingly
12. Use emotion tags like [warm], [reassuring], [enthusiastic] where appropriate
13. Match caller energy — upbeat with upbeat callers, calm with concerned ones
14. Tailor the tone to what the practice owner described above

Respond with ONLY a valid JSON object in this exact format — no markdown fences, no explanation:
{"practiceName":"...","voiceGender":"female","systemPrompt":"..."}`,
        },
      ],
    });

    const rawText =
      claudeResponse.content[0].type === "text"
        ? claudeResponse.content[0].text
        : "";

    if (!rawText) {
      throw new Error("Failed to generate system prompt");
    }

    // Parse JSON response, tolerating possible code fences
    let extracted: ExtractedData;
    try {
      const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/, "")
        .trim();
      extracted = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse Claude JSON:", rawText.slice(0, 500));
      throw new Error("Failed to parse AI response. Please try again.");
    }

    const practiceName = extracted.practiceName?.trim() || "Your Dental Practice";
    const voiceGender = extracted.voiceGender === "male" ? "male" : "female";
    const systemPrompt = extracted.systemPrompt?.trim();

    if (!systemPrompt) {
      throw new Error("Failed to generate system prompt");
    }

    const voiceId =
      voiceGender === "male"
        ? "34575e71-908f-4ab6-ab54-b08c95d6597d"
        : "e3827ec5-697a-4b7c-9704-1a23041bbc51";

    // Create Vapi assistant
    const vapiResponse = await fetch("https://api.vapi.ai/assistant", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Demo - ${practiceName}`.slice(0, 40),
        model: {
          provider: "anthropic",
          model: "claude-sonnet-4-5-20250929",
          systemPrompt: systemPrompt,
          temperature: 0.7,
          maxTokens: 300,
        },
        voice: {
          provider: "cartesia",
          voiceId: voiceId,
          model: "sonic-3",
        },
        transcriber: {
          provider: "deepgram",
          model: "nova-3",
          language: "en-US",
          smartFormat: true,
          endpointing: 300,
          confidenceThreshold: 0.4,
          keywords: [
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
            "appointment:5",
            "schedule:5",
            "reschedule:5",
            "cancellation:5",
            "abscess:5",
            "molar:5",
            "bicuspid:5",
            "incisor:5",
            "plaque:5",
            "tartar:5",
            "sensitivity:5",
            "swelling:5",
            "bleeding:5",
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
            "panoramic:5",
            "bitewing:5",
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
        firstMessage: `Thanks for calling ${practiceName}, how can I help you today?`,
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
      practiceName: practiceName,
    });
  } catch (error) {
    console.error("Create demo error:", error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
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
