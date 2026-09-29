import { ListPage, inr } from "./shared";
import { REQUESTS } from "./adminData";

export default function CustomArtRequests() {
  return (
    <ListPage
      title="Custom Art Requests"
      subtitle="Manage commission requests from buyers."
      data={REQUESTS}
      columns={[
        { label: "Request", key: "id" },
        { label: "Buyer", key: "buyer" },
        { label: "Artist", key: "artist" },
        { label: "Brief", key: "brief" },
        { label: "Budget", key: "budget", fmt: inr },
        { label: "Status", key: "status" },
      ]}
      searchKeys={["id", "buyer", "artist", "brief"]}
      filterKey="status"
      statusActions={[["Start work", "In Progress"], ["Mark completed", "Completed"], ["Reject", "Rejected"]]}
    />
  );
}