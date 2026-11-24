import PaymentFrame from "@/components/PaymentFrame";
import { getOrder, orderIdPattern } from "@/lib/payments/orders";
import styles from "../payment.module.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Status do pagamento | AgroTerry",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const messages = {
  approved: "Pagamento confirmado",
  pending: "Aguardando confirmação do pagamento",
  rejected: "Pagamento não aprovado",
  reversed: "Pagamento estornado ou revertido",
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
    <PaymentFrame title="Status do pagamento" description="Acompanhe a confirmação do seu pedido.">
      <h3>{unavailable ? "Consulta temporariamente indisponível"
        : order ? messages[order.status] : "Pedido não encontrado"}</h3>
      {order && <p>{order.title}</p>}
      {retry && (
        <div>
          <a className={styles.action} href={"/pagamento/retorno?pedido=" + pedido}>Atualizar status</a>
        </div>
      )}
      {order?.status === "rejected" && (
        <div><a className={styles.action} href="/pagamento">Voltar ao pagamento</a></div>
      )}
      {order && <p className={styles.reference}>Referência do pedido <code>{pedido}</code></p>}
    </PaymentFrame>
  );
}
