const DEFAULT_OPTIONS: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "KES",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

const formatterCache = new Map<string, Intl.NumberFormat>();

const getFormatter = (options?: Intl.NumberFormatOptions) => {
  const key = JSON.stringify(options ?? DEFAULT_OPTIONS);
  if (!formatterCache.has(key)) {
    formatterCache.set(key, new Intl.NumberFormat("en-KE", options ?? DEFAULT_OPTIONS));
  }
  return formatterCache.get(key)!;
};

export const formatKES = (
  amount: number | string | null | undefined,
  options?: Intl.NumberFormatOptions
) => {
  const numericValue =
    typeof amount === "string" ? Number.parseFloat(amount) : amount ?? 0;

  if (!Number.isFinite(numericValue)) {
    return "KES 0";
  }

  const formatter = getFormatter({
    ...DEFAULT_OPTIONS,
    ...(options ?? {}),
  });

  return formatter.format(numericValue).replace(/\u00a0/g, " ");
};

