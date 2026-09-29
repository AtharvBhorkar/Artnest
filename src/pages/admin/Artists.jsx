import { ListPage, inr } from "./shared";
import { ARTISTS } from "./adminData";

export default function Artists() {
  return (
    <ListPage
      title="Artists"
      subtitle="Manage artist profiles, verification and performance."
      data={ARTISTS}
      columns={[
        { label: "Artist", key: "name" },
        { label: "Specialty", key: "specialty" },
        { label: "City", key: "city" },
        { label: "Works", key: "works" },
        { label: "Sales", key: "sales", fmt: inr },
        { label: "Status", key: "status" },
      ]}
      searchKeys={["name", "city", "specialty"]}
      filterKey="status"
      statusActions={[["Verify artist", "Active"], ["Block artist", "Blocked"]]}
    />
  );
}