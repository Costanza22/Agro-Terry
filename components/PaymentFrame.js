import SiteFrame from "@/components/SiteFrame";
import styles from "@/app/pagamento/payment.module.css";

export default function PaymentFrame({ title, description, children }) {
  return (
    <SiteFrame>
      <main className={styles.shell}>
        <div className="container">
          <div className={styles.layout}>
            <div className={styles.hero}>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <div className={styles.panel}>{children}</div>
          </div>
        </div>
      </main>
    </SiteFrame>
  );
}
