import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyticsRequest {
  type: 'prediction' | 'insights' | 'roi_analysis';
  data: {
    sales?: number[];
    habits?: number[];
    period?: string;
    current_month?: number;
    target?: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: AnalyticsRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case 'prediction':
        systemPrompt = "You are an expert sales analytics AI. Analyze sales data and provide accurate predictions with confidence intervals.";
        userPrompt = `Given the following sales data for the past months: ${JSON.stringify(data.sales)}
        
Current month sales: ${data.current_month}
Target: ${data.target}

Provide a prediction for:
1. Next month's expected sales (with 90% confidence interval)
2. Probability of reaching the target
3. Key trends identified
4. Recommended actions

Format as JSON: { prediction: number, confidence_low: number, confidence_high: number, probability: number, trends: string[], recommendations: string[] }`;
        break;

      case 'insights':
        systemPrompt = "You are a business intelligence AI specialized in sales performance analysis.";
        userPrompt = `Analyze this sales and habits data:
        
Sales over time: ${JSON.stringify(data.sales)}
Habits completion rates: ${JSON.stringify(data.habits)}

Provide actionable insights about:
1. Correlation between habits and sales
2. Performance patterns
3. Areas of improvement
4. Potential risks

Format as JSON: { roi_score: number, correlations: string[], patterns: string[], improvements: string[], risks: string[] }`;
        break;

      case 'roi_analysis':
        systemPrompt = "You are an ROI calculation expert. Calculate the return on investment of habit-based sales training.";
        userPrompt = `Calculate ROI based on:
        
Baseline sales (before habits): ${data.sales?.[0] || 0}
Current sales (with habits): ${data.current_month || 0}
Habit completion rate: ${(data.habits?.[data.habits.length - 1] || 0) * 100}%

Provide detailed ROI analysis as JSON: { roi_percentage: number, revenue_increase: number, efficiency_gain: number, cost_benefit: string, summary: string }`;
        break;

      default:
        throw new Error("Invalid analysis type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    console.log("AI Analysis completed:", type);

    return new Response(
      JSON.stringify({ result: JSON.parse(content), type }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in advanced-analytics:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
