import { ListPage } from "./shared";
import { REVIEWS } from "./adminData";

export default function Reviews() {
  return (
    <ListPage
      title="Reviews"
      subtitle="Moderate reviews left on artworks and artists."
      data={REVIEWS}
      columns={[
        { label: "Artwork", key: "artwork" },
        { label: "Buyer", key: "buyer" },
        { label: "Rating", key: "rating", fmt: (n) => `${n} / 5` },
        { label: "Comment", key: "comment" },
        { label: "Status", key: "status" },
      ]}
      searchKeys={["artwork", "buyer", "comment"]}
      filterKey="status"
      statusActions={[["Approve", "Approved"], ["Reject", "Rejected"]]}
    />
  );
}
