import { createHmac, timingSafeEqual } from "node:crypto";

async function mercadoPago(path, options = {}) {
  const response = await fetch("https://api.mercadopago.com" + path, {
    ...options,
    headers: {
      Authorization: "Bearer " + process.env.MERCADO_PAGO_ACCESS_TOKEN,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Falha na API do Mercado Pago (" + response.status + ").");
  return response.json();
}

export async function createPreference(orderId, offer) {
  const returnUrl = new URL("/pagamento/retorno", offer.siteOrigin);
  returnUrl.searchParams.set("pedido", orderId);
  const preference = await mercadoPago("/checkout/preferences", {
    method: "POST",
    body: JSON.stringify({
      items: [{
        id: "agroterry-oferta",
        title: offer.title,
        quantity: 1,
        currency_id: "BRL",
        unit_price: offer.amountCents / 100,
      }],
      external_reference: orderId,
      back_urls: {
        success: returnUrl.href,
        pending: returnUrl.href,
        failure: returnUrl.href,
      },
      auto_return: "approved",
    }),
  });

  const url = new URL(preference.init_point);
  if (url.origin !== "https://www.mercadopago.com.br" &&
      url.origin !== "https://www.mercadopago.com") {
    throw new Error("URL de checkout inesperada.");
  }
  return url;
}

export function verifyPaymentNotification(request, paymentId) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  const requestId = request.headers.get("x-request-id");
  const signature = request.headers.get("x-signature") ?? "";
  const fields = new URLSearchParams(signature.split(",").map((part) => part.trim()).join("&"));
  const timestamp = fields.get("ts");
  const digest = fields.get("v1");

  if (!secret || !requestId || !/^\d+$/.test(timestamp ?? "") ||
      !/^[0-9a-f]{64}$/i.test(digest ?? "")) return false;

  const manifest = "id:" + paymentId + ";request-id:" + requestId + ";ts:" + timestamp + ";";
  const expected = createHmac("sha256", secret).update(manifest).digest();
  return timingSafeEqual(expected, Buffer.from(digest, "hex"));
}

const paymentStatuses = new Map([
  ["approved", "approved"],
  ["pending", "pending"],
  ["in_process", "pending"],
  ["authorized", "pending"],
  ["in_mediation", "pending"],
  ["rejected", "rejected"],
  ["cancelled", "rejected"],
  ["refunded", "reversed"],
  ["charged_back", "reversed"],
]);

export async function getPayment(id) {
  const payment = await mercadoPago("/v1/payments/" + id);
  const status = paymentStatuses.get(payment.status);
  const updatedAt = Date.parse(payment.date_last_updated);
  if (String(payment.id) !== id || payment.currency_id !== "BRL" ||
      !status || !Number.isFinite(updatedAt) || !Number.isFinite(payment.transaction_amount)) {
    return null;
  }

  return {
    id,
    orderId: payment.external_reference,
    amountCents: Math.round(payment.transaction_amount * 100),
    updatedAt,
    status,
  };
}
