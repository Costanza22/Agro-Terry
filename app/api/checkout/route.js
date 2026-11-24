import { randomUUID } from "node:crypto";
import { getOffer } from "@/lib/payments/config";
import { createPreference } from "@/lib/payments/mercado-pago";
import { createOrder } from "@/lib/payments/orders";

export async function POST(request) {
  const offer = getOffer();
  if (!offer) return new Response("Pagamento indisponível.", { status: 503 });
  if (request.headers.get("origin") !== offer.siteOrigin) {
    return new Response("Origem inválida.", { status: 403 });
  }

  try {
    const orderId = randomUUID();
    await createOrder(orderId, offer);
    return Response.redirect(await createPreference(orderId, offer), 303);
  } catch (error) {
    console.error("Erro ao iniciar checkout:", error.message);
    return Response.redirect(new URL("/pagamento?erro=checkout", offer.siteOrigin), 303);
  }
}
