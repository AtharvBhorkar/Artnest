import { ListPage, inr } from "./shared";
import { ORDERS } from "./adminData";

export default function Orders() {
  return (
    <ListPage
      title="Orders"
      subtitle="Track and fulfil every order placed on ArtNest."
      data={ORDERS}
      columns={[
        { label: "Order", key: "id" },
        { label: "Buyer", key: "buyer" },
        { label: "Artwork", key: "item" },
        { label: "Amount", key: "amount", fmt: inr },
        { label: "Date", key: "date" },
        { label: "Status", key: "status" },
      ]}
      searchKeys={["id", "buyer", "item"]}
      filterKey="status"
      statusActions={[["Mark processing", "Processing"], ["Mark completed", "Completed"], ["Cancel order", "Cancelled"]]}
    />
  );
}