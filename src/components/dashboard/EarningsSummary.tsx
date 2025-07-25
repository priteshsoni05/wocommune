import { DollarSign, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EarningsData {
  totalSessions: number;
  totalPayout: number;
  pendingPayout: number;
  thisMonth: number;
}

const mockEarnings: EarningsData = {
  totalSessions: 47,
  totalPayout: 2340,
  pendingPayout: 180,
  thisMonth: 920
};

export const EarningsSummary = () => {
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
            <p className="text-2xl font-light">{mockEarnings.totalSessions}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">This Month</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-light">${mockEarnings.thisMonth}</p>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Earned</span>
            <span className="font-medium">${mockEarnings.totalPayout.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Pending Payout</span>
            <span className="font-medium text-warning">${mockEarnings.pendingPayout}</span>
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