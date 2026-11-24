const requiredKeys = [
  "MERCADO_PAGO_ACCESS_TOKEN",
  "MERCADO_PAGO_WEBHOOK_SECRET",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

export function getOffer() {
  const title = process.env.CHECKOUT_OFFER_TITLE?.trim();
  const amount = process.env.CHECKOUT_OFFER_AMOUNT_CENTS;
  const amountCents = Number(amount);

  if (!title || title.length > 120 || !/^[1-9]\d*$/.test(amount ?? "") ||
      !Number.isSafeInteger(amountCents) || amountCents > 999999999 ||
      !requiredKeys.every((key) => process.env[key]?.trim())) {
    return null;
  }

  try {
    const site = new URL(process.env.CHECKOUT_SITE_URL);
    if (site.protocol !== "https:" || site.href !== site.origin + "/") return null;
    return { title, amountCents, siteOrigin: site.origin };
  } catch {
    return null;
  }
}
