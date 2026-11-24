import SiteFrame from "@/components/SiteFrame";
import { getOffer } from "@/lib/payments/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pagamento | AgroTerry" };

export default async function PaymentPage({ searchParams }) {
  const offer = getOffer();
  const { erro } = await searchParams;

  return (
    <SiteFrame>
      <main className="container py-5">
        <h2 className="mb-4">Pagamento</h2>
        {offer ? (
          <>
            <h3 className="mb-3">{offer.title}</h3>
            <p className="mb-3">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(offer.amountCents / 100)}
            </p>
            {erro === "checkout" && (
              <p className="alert alert-danger" role="alert">
                Não foi possível abrir o checkout. Tente novamente em instantes.
              </p>
            )}
            <form action="/api/checkout" method="post">
              <button className="btn btn-success" type="submit">Pagar com Mercado Pago</button>
            </form>
          </>
        ) : (
          <p>Pagamento online indisponível no momento. <a href="/contact">Entre em contato</a>.</p>
        )}
      </main>
    </SiteFrame>
  );
}
