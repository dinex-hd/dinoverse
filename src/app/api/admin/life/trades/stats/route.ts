import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { isRequestAuthorized } from '@/lib/adminAuth';
import { Trade } from '@/models/Trade';
import { startOfWeek, endOfWeek, subDays } from 'date-fns';

export async function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const filter: any = { status: 'closed' }; // Only count closed trades for stats
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const trades = await Trade.find(filter).sort({ date: -1 }).lean();

  // Filter trades with valid results
  const tradesWithResults = trades.filter((t) => t.resultR != null || t.resultPct != null);

  // Win rate calculation (based on resultR > 0 or resultPct > 0)
  const winningTrades = tradesWithResults.filter(
    (t) => (t.resultR != null && t.resultR > 0) || (t.resultPct != null && t.resultPct > 0)
  );
  const losingTrades = tradesWithResults.filter(
    (t) => (t.resultR != null && t.resultR < 0) || (t.resultPct != null && t.resultPct < 0)
  );
  const totalClosed = tradesWithResults.length;
  const winRate = totalClosed > 0 ? Math.round((winningTrades.length / totalClosed) * 100) : 0;

  // Average R
  const validRValues = tradesWithResults
    .map((t) => t.resultR)
    .filter((r): r is number => r != null);
  const avgR = validRValues.length > 0 ? validRValues.reduce((a, b) => a + b, 0) / validRValues.length : 0;

  // Rule compliance rate
  const compliantTrades = trades.filter(
    (t) =>
      t.ruleChecks &&
      t.ruleChecks.followedPlan === true &&
      t.ruleChecks.respectedDailyLoss === true &&
      t.ruleChecks.validSession === true &&
      t.ruleChecks.emotional === false
  );
  const totalWithRules = trades.length;
  const ruleComplianceRate = totalWithRules > 0 ? Math.round((compliantTrades.length / totalWithRules) * 100) : 0;

  // Win rate when rules respected
  const compliantTradesWithResults = compliantTrades.filter(
    (t) => t.resultR != null || t.resultPct != null
  );
  const winningCompliantTrades = compliantTradesWithResults.filter(
    (t) => (t.resultR != null && t.resultR > 0) || (t.resultPct != null && t.resultPct > 0)
  );
  const winRateWhenRulesRespected =
    compliantTradesWithResults.length > 0
      ? Math.round((winningCompliantTrades.length / compliantTradesWithResults.length) * 100)
      : 0;

  // Days without rule break (count consecutive days from today backwards)
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  let daysWithoutRuleBreak = 0;
  const brokenRuleDates = new Set<string>();
  trades.forEach((t) => {
    if (
      t.ruleChecks &&
      (t.ruleChecks.followedPlan === false ||
        t.ruleChecks.respectedDailyLoss === false ||
        t.ruleChecks.validSession === false ||
        t.ruleChecks.emotional === true)
    ) {
      const dateStr = new Date(t.date).toISOString().split('T')[0];
      brokenRuleDates.add(dateStr);
    }
  });

  // Count consecutive days without rule breaks
  let checkDate = new Date(today);
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (brokenRuleDates.has(dateStr)) {
      break;
    }
    daysWithoutRuleBreak++;
    checkDate = subDays(checkDate, 1);
    // Stop after 365 days to avoid infinite loop
    if (daysWithoutRuleBreak >= 365) break;
  }

  // Trades this week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const tradesThisWeek = trades.filter((t) => {
    const tradeDate = new Date(t.date);
    return tradeDate >= weekStart && tradeDate <= weekEnd;
  }).length;

  // Rules broken this week
  const rulesBrokenThisWeek = trades.filter((t) => {
    const tradeDate = new Date(t.date);
    const inWeek = tradeDate >= weekStart && tradeDate <= weekEnd;
    return (
      inWeek &&
      t.ruleChecks &&
      (t.ruleChecks.followedPlan === false ||
        t.ruleChecks.respectedDailyLoss === false ||
        t.ruleChecks.validSession === false ||
        t.ruleChecks.emotional === true)
    );
  }).length;

  // Total P&L
  const totalPnL = tradesWithResults.reduce((sum, t) => {
    if (t.pnl != null) return sum + t.pnl;
    // If no pnl, estimate from resultR * riskPerTrade (if available)
    if (t.resultR != null && t.riskPerTrade != null) return sum + t.resultR * t.riskPerTrade;
    return sum;
  }, 0);

  return NextResponse.json({
    ok: true,
    stats: {
      totalTrades: trades.length,
      totalClosed: totalClosed,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      avgR: Math.round(avgR * 100) / 100,
      ruleComplianceRate,
      winRateWhenRulesRespected,
      daysWithoutRuleBreak,
      tradesThisWeek,
      rulesBrokenThisWeek,
      totalPnL: Math.round(totalPnL * 100) / 100,
    },
  });
}

