import PaymentFrame from "@/components/PaymentFrame";
import { getOffer } from "@/lib/payments/config";
import styles from "./payment.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pagamento | AgroTerry" };

export default async function PaymentPage({ searchParams }) {
  const offer = getOffer();
  const { erro } = await searchParams;

  return (
    <PaymentFrame title="Pagamento online" description="Pague pelo seu serviço AgroTerry com o Mercado Pago.">
      {offer ? (
        <>
          <h3>{offer.title}</h3>
          <strong className={styles.price}>
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(offer.amountCents / 100)}
          </strong>
          <ul className={styles.methods} aria-label="Formas de pagamento">
            <li>Pix</li>
            <li>Cartão</li>
          </ul>
          {erro === "checkout" && (
            <p className={styles.notice} role="alert">
              Não foi possível abrir o checkout. Tente novamente em instantes.
            </p>
          )}
          <form action="/api/checkout" method="post">
            <button className={styles.action} type="submit">Continuar para o Mercado Pago</button>
          </form>
          <p className={styles.hint}>Você vai concluir o pagamento no site do Mercado Pago.</p>
        </>
      ) : (
        <>
          <h3>Pagamento online indisponível</h3>
          <p>Fale com nossa equipe para saber como pagar pelo seu serviço.</p>
          <div><a className={styles.action} href="/contact">Falar com a AgroTerry</a></div>
        </>
      )}
    </PaymentFrame>
  );
}
