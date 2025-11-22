export function formatCurrency(amount: number, currency: string = "AED"): string {
  if (currency === "AED") {
    return `د.إ ${new Intl.NumberFormat("en-AE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)}`
  }
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

