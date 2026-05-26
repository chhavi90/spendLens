//  Tool & Plan Types 

export type ToolId =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolPlan {
  id: string;
  name: string;
  monthlyPricePerSeat: number; // USD
  annualPricePerSeat?: number; // USD if discounted
  minSeats?: number;
  maxSeats?: number;
  features: string[];
  bestFor: UseCase[];
}

export interface ToolDefinition {
  id: ToolId;
  name: string;
  vendor: string;
  pricingUrl: string;
  plans: ToolPlan[];
  category: "coding" | "chat" | "api";
}

//  Form / Input Types 

export interface ToolEntry {
  toolId: ToolId;
  planId: string;
  seats: number;
  monthlySpend: number; // what they're actually paying (may differ from catalog price)
}

export interface AuditFormData {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
  companyName?: string;
}

//  Audit Engine Types 

export type RecommendationAction =
  | "downgrade_plan"
  | "upgrade_plan"
  | "switch_tool"
  | "use_credits"
  | "optimize_seats"
  | "already_optimal";

export interface Recommendation {
  action: RecommendationAction;
  targetToolId?: ToolId;
  targetPlanId?: string;
  reason: string;
  monthlySavings: number;
  annualSavings: number;
  confidence: "high" | "medium" | "low";
}

export interface ToolAuditResult {
  toolEntry: ToolEntry;
  toolDef: ToolDefinition;
  currentPlan: ToolPlan;
  currentMonthlyCost: number;
  recommendations: Recommendation[];
  bestRecommendation: Recommendation;
  flags: AuditFlag[];
}

export type AuditFlag =
  | "overpaying_vs_catalog"
  | "wrong_plan_for_team_size"
  | "better_tool_for_usecase"
  | "credits_available"
  | "already_optimal";

export interface AuditSummary {
  totalCurrentMonthly: number;
  totalOptimizedMonthly: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  toolResults: ToolAuditResult[];
  aiSummary?: string;
  isAlreadyOptimal: boolean;
  highSavingsCase: boolean; // >$500/mo savings
  createdAt: string;
  id?: string; // set after persistence
}

//  Lead & Storage Types 

export interface LeadCapture {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  totalSavings: number;
  createdAt: string;
}

export interface SavedAudit {
  id: string;
  formData: AuditFormData;
  summary: AuditSummary;
  createdAt: string;
  emailCaptured: boolean;
}
