import { ListPage } from "./shared";
import { COLLECTIONS } from "./adminData";

export default function Collections() {
  return (
    <ListPage
      title="Collections"
      subtitle="Build and publish themed collections."
      data={COLLECTIONS}
      columns={[
        { label: "Collection", key: "name" },
        { label: "Artworks", key: "items" },
        { label: "Curator", key: "curator" },
        { label: "Status", key: "status" },
      ]}
      searchKeys={["name", "curator"]}
      filterKey="status"
      statusActions={[["Publish", "Published"], ["Move to draft", "Draft"]]}
    />
  );
}