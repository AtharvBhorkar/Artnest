import { ListPage, inr } from "./shared";
import { SCULPTURES } from "./adminData";

export default function Sculptures() {
  return (
    <ListPage
      title="Sculptures"
      subtitle="Manage sculpture listings across the gallery."
      data={SCULPTURES}
      columns={[
        { label: "Title", key: "title" },
        { label: "Artist", key: "artist" },
        { label: "Material", key: "material" },
        { label: "Price", key: "price", fmt: inr },
        { label: "Status", key: "status" },
      ]}
      searchKeys={["title", "artist", "material"]}
      filterKey="status"
      statusActions={[["Approve", "Approved"], ["Reject", "Rejected"]]}
    />
  );
}