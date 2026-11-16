export const currencyFormatter = new Intl.NumberFormat("es-PE", {
    currency: "PEN",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency"
});

export const compactCurrencyFormatter = new Intl.NumberFormat("es-PE", {
    currency: "PEN",
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency"
});

export function formatCurrency(value: number): string {
    return currencyFormatter.format(value);
}

export function formatCompactCurrency(value: number): string {
    return compactCurrencyFormatter.format(value);
}

export function formatDate(value: string): string {
    if (!value) {
        return "Sin fecha";
    }

    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) {
        return value;
    }

    return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date(year, month - 1, day));
}

export function todayIso(): string {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}
