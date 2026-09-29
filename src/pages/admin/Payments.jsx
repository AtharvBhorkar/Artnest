import { ListPage, inr } from "./shared";
import { PAYMENTS } from "./adminData";

export default function Payments() {
  return (
    <ListPage
      title="Payments"
      subtitle="Track artist payouts and transaction status."
      data={PAYMENTS}
      columns={[
        { label: "Payment", key: "id" },
        { label: "Order", key: "order" },
        { label: "Artist", key: "artist" },
        { label: "Amount", key: "amount", fmt: inr },
        { label: "Method", key: "method" },
        { label: "Status", key: "status" },
      ]}
      searchKeys={["id", "order", "artist"]}
      filterKey="status"
      statusActions={[["Mark paid", "Paid"]]}
    />
  );
}