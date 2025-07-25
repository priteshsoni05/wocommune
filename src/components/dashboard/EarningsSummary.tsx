import { DollarSign, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEarnings } from "@/hooks/useEarnings";
import { useBookings } from "@/hooks/useBookings";

export const EarningsSummary = () => {
  const { getTotalEarnings, getPendingEarnings, getThisMonthEarnings, loading: earningsLoading } = useEarnings();
  const { bookings, loading: bookingsLoading } = useBookings();
  
  const totalSessions = bookings.filter(b => b.status === 'completed').length;
  const totalPayout = getTotalEarnings();
  const pendingPayout = getPendingEarnings();
  const thisMonth = getThisMonthEarnings();

  if (earningsLoading || bookingsLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Earnings Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading earnings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Earnings Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Sessions</p>
            <p className="text-2xl font-light">{totalSessions}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">This Month</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-light">${thisMonth.toFixed(2)}</p>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Earned</span>
            <span className="font-medium">${totalPayout.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Pending Payout</span>
            <span className="font-medium text-warning">${pendingPayout.toFixed(2)}</span>
          </div>
        </div>
        
        <Button className="w-full gap-2 mt-4">
          <Download className="h-4 w-4" />
          Request Withdrawal
        </Button>
      </CardContent>
    </Card>
  );
};