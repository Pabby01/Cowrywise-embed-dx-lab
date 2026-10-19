export interface PayrollAllocation {
  emergencyPercent: number;
  eurobondsPercent: number;
  netCheckingPercent: number;
}

export function splitSalary(monthlySalary: number, allocation: PayrollAllocation) {
  return {
    emergencyAmount: (monthlySalary * allocation.emergencyPercent) / 100,
    eurobondsAmount: (monthlySalary * allocation.eurobondsPercent) / 100,
    netCheckingAmount: (monthlySalary * allocation.netCheckingPercent) / 100
  };
}
