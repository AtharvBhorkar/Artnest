import { ListPage } from "./shared";
import { MESSAGES } from "./adminData";

export default function Messages() {
  return (
    <ListPage
      title="Messages"
      subtitle="Conversations with artists and buyers."
      data={MESSAGES}
      columns={[
        { label: "From", key: "from" },
        { label: "Role", key: "role" },
        { label: "Subject", key: "subject" },
        { label: "Time", key: "time" },
        { label: "Status", key: "status" },
      ]}
      searchKeys={["from", "subject"]}
      filterKey="status"
      statusActions={[["Mark as read", "Read"], ["Mark as unread", "Unread"]]}
    />
  );
}