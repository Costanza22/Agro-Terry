import SiteFrame from "@/components/SiteFrame";
import { getOrder, orderIdPattern } from "@/lib/payments/orders";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Status do pagamento | AgroTerry",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const messages = {
  approved: "Pagamento confirmado.",
  pending: "Aguardando confirmação do pagamento.",
  rejected: "Pagamento não aprovado.",
  reversed: "Pagamento estornado ou revertido.",
};

export default async function PaymentReturnPage({ searchParams }) {
  const { pedido } = await searchParams;
  let order;
  let unavailable = false;

  try {
    order = await getOrder(pedido);
  } catch {
    unavailable = true;
  }

  const retry = (unavailable || order?.status === "pending") &&
    typeof pedido === "string" && orderIdPattern.test(pedido);

  return (
    <SiteFrame>
      <main className="container py-5">
        <h2 className="mb-4">Status do pagamento</h2>
        {order && <h3 className="mb-3">{order.title}</h3>}
        <p className="mb-3">
          {unavailable ? "Não foi possível consultar o pedido agora."
            : order ? messages[order.status] : "Pedido não encontrado."}
        </p>
        {retry && (
          <a className="btn btn-success" href={"/pagamento/retorno?pedido=" + pedido}>
            Atualizar status
          </a>
        )}
        {order?.status === "rejected" && <a href="/pagamento">Voltar ao pagamento</a>}
        {order && <p className="mt-3">Referência do pedido <code>{pedido}</code></p>}
      </main>
    </SiteFrame>
  );
}
