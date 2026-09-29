import { ListPage } from "./shared";
import { USERS } from "./adminData";

export default function Users() {
  return (
    <ListPage
      title="Users"
      subtitle="View buyer accounts and activity."
      data={USERS}
      columns={[
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Orders", key: "orders" },
        { label: "Joined", key: "joined" },
        { label: "Status", key: "status" },
      ]}
      searchKeys={["name", "email"]}
      filterKey="status"
      statusActions={[["Unblock", "Active"], ["Block user", "Blocked"]]}
    />
  );
}