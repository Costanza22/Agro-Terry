import { getPayment, verifyPaymentNotification } from "@/lib/payments/mercado-pago";
import { orderIdPattern, recordPayment } from "@/lib/payments/orders";

export async function POST(request) {
  const query = new URL(request.url).searchParams;
  if (query.get("type") !== "payment") return new Response(null, { status: 200 });

  const paymentId = query.get("data.id");
  if (!/^\d+$/.test(paymentId ?? "") || !verifyPaymentNotification(request, paymentId)) {
    return new Response(null, { status: 401 });
  }

  try {
    const payment = await getPayment(paymentId);
    if (payment && typeof payment.orderId === "string" && orderIdPattern.test(payment.orderId)) {
      await recordPayment(payment.orderId, payment);
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar notificação de pagamento:", error.message);
    return new Response(null, { status: 503 });
  }
}
