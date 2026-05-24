import { ToolDefinition } from "../types";

// All prices verified from official pricing pages — see PRICING_DATA.md
// Last updated: 2025-05-21

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    id: "cursor",
    name: "Cursor",
    vendor: "Anysphere",
    pricingUrl: "https://cursor.sh/pricing",
    category: "coding",
    plans: [
      {
        id: "hobby",
        name: "Hobby",
        monthlyPricePerSeat: 0,
        features: ["2000 completions/mo", "50 slow premium requests"],
        bestFor: ["coding"],
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPricePerSeat: 20,
        annualPricePerSeat: 16,
        features: ["Unlimited completions", "500 fast premium requests", "Unlimited slow requests"],
        bestFor: ["coding"],
      },
      {
        id: "business",
        name: "Business",
        monthlyPricePerSeat: 40,
        annualPricePerSeat: 40,
        minSeats: 1,
        features: ["All Pro features", "Centralized billing", "Admin dashboard", "SSO/SAML"],
        bestFor: ["coding"],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 0, // custom
        features: ["Custom contracts", "Dedicated support", "Compliance"],
        bestFor: ["coding"],
      },
    ],
  },
  {
    id: "github_copilot",
    name: "GitHub Copilot",
    vendor: "GitHub / Microsoft",
    pricingUrl: "https://github.com/features/copilot#pricing",
    category: "coding",
    plans: [
      {
        id: "individual",
        name: "Individual",
        monthlyPricePerSeat: 10,
        annualPricePerSeat: 100 / 12,
        features: ["Code completions", "Chat in IDE", "CLI"],
        bestFor: ["coding"],
      },
      {
        id: "business",
        name: "Business",
        monthlyPricePerSeat: 19,
        features: ["All Individual", "License management", "Policy controls"],
        bestFor: ["coding"],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 39,
        features: ["All Business", "Fine-tuned models", "Copilot Chat in GitHub.com", "PR summaries"],
        bestFor: ["coding"],
      },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    pricingUrl: "https://www.anthropic.com/pricing",
    category: "chat",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPricePerSeat: 0,
        features: ["Limited usage", "Claude 3.5 Sonnet access"],
        bestFor: ["writing", "research", "mixed"],
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPricePerSeat: 20,
        features: ["5x more usage", "Early access to features", "Projects"],
        bestFor: ["writing", "research", "coding", "mixed"],
      },
      {
        id: "max",
        name: "Max",
        monthlyPricePerSeat: 100,
        features: ["20x more usage than Pro", "All models", "Priority access"],
        bestFor: ["research", "data", "mixed"],
      },
      {
        id: "team",
        name: "Team",
        monthlyPricePerSeat: 30,
        minSeats: 5,
        features: ["More usage than Pro", "Collaboration features", "Admin console"],
        bestFor: ["coding", "writing", "mixed"],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 0, // custom, typically 60+
        features: ["Custom usage", "SSO", "Audit logs", "Data retention controls"],
        bestFor: ["coding", "writing", "data", "research", "mixed"],
      },
      {
        id: "api",
        name: "API Direct",
        monthlyPricePerSeat: 0, // usage-based
        features: ["Pay per token", "All models", "Full control"],
        bestFor: ["coding", "data"],
      },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    pricingUrl: "https://openai.com/chatgpt/pricing/",
    category: "chat",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPricePerSeat: 0,
        features: ["GPT-4o mini", "Limited GPT-4o"],
        bestFor: ["writing", "research", "mixed"],
      },
      {
        id: "plus",
        name: "Plus",
        monthlyPricePerSeat: 20,
        features: ["GPT-4o", "DALL-E", "Advanced data analysis", "Plugins"],
        bestFor: ["writing", "research", "data", "mixed"],
      },
      {
        id: "team",
        name: "Team",
        monthlyPricePerSeat: 30,
        annualPricePerSeat: 25,
        minSeats: 2,
        features: ["All Plus", "Admin workspace", "Higher limits", "Data excluded from training"],
        bestFor: ["writing", "research", "data", "mixed"],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 0, // custom
        features: ["Custom usage", "SSO", "Compliance", "Custom models"],
        bestFor: ["writing", "research", "data", "mixed"],
      },
      {
        id: "api",
        name: "API Direct",
        monthlyPricePerSeat: 0,
        features: ["Pay per token", "All models", "Full control"],
        bestFor: ["coding", "data"],
      },
    ],
  },
  {
    id: "anthropic_api",
    name: "Anthropic API",
    vendor: "Anthropic",
    pricingUrl: "https://www.anthropic.com/pricing#api",
    category: "api",
    plans: [
      {
        id: "pay_as_you_go",
        name: "Pay As You Go",
        monthlyPricePerSeat: 0,
        features: [
          "Claude Haiku 3.5: $0.80/MTok input, $4/MTok output",
          "Claude Sonnet 4: $3/MTok input, $15/MTok output",
          "Claude Opus 4: $15/MTok input, $75/MTok output",
        ],
        bestFor: ["coding", "data"],
      },
    ],
  },
  {
    id: "openai_api",
    name: "OpenAI API",
    vendor: "OpenAI",
    pricingUrl: "https://openai.com/api/pricing/",
    category: "api",
    plans: [
      {
        id: "pay_as_you_go",
        name: "Pay As You Go",
        monthlyPricePerSeat: 0,
        features: [
          "GPT-4o mini: $0.15/MTok input, $0.60/MTok output",
          "GPT-4o: $2.50/MTok input, $10/MTok output",
          "o3: $10/MTok input, $40/MTok output",
        ],
        bestFor: ["coding", "data"],
      },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    pricingUrl: "https://one.google.com/about/ai-premium",
    category: "chat",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPricePerSeat: 0,
        features: ["Gemini 1.5 Flash", "Limited Gemini 1.5 Pro"],
        bestFor: ["writing", "research", "mixed"],
      },
      {
        id: "advanced",
        name: "Advanced (Google One AI Premium)",
        monthlyPricePerSeat: 19.99,
        features: ["Gemini 1.5 Ultra", "2TB storage", "Gemini in Workspace"],
        bestFor: ["writing", "research", "data", "mixed"],
      },
      {
        id: "api",
        name: "API",
        monthlyPricePerSeat: 0,
        features: ["Pay per token", "All models via API"],
        bestFor: ["coding", "data"],
      },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    vendor: "Codeium",
    pricingUrl: "https://windsurf.com/pricing",
    category: "coding",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPricePerSeat: 0,
        features: ["Basic completions", "5 Flow actions/day"],
        bestFor: ["coding"],
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPricePerSeat: 15,
        features: ["Unlimited completions", "Unlimited Flow actions", "GPT-4o + Claude access"],
        bestFor: ["coding"],
      },
      {
        id: "teams",
        name: "Teams",
        monthlyPricePerSeat: 35,
        minSeats: 5,
        features: ["All Pro", "Team management", "Admin controls"],
        bestFor: ["coding"],
      },
    ],
  },
];

export const getToolById = (id: string): ToolDefinition | undefined =>
  TOOL_DEFINITIONS.find((t) => t.id === id);

export const getPlanById = (toolId: string, planId: string) => {
  const tool = getToolById(toolId);
  return tool?.plans.find((p) => p.id === planId);
};
