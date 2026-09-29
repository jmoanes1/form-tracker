import Dashboard from "../Dashboard";

function LeadsWebsites(props) {
  return (
    <Dashboard
      {...props}
      initialTypeFilter="leads"
      pageTitle="Leads Websites"
      pageDescription="Manage and test websites assigned to leads."
    />
  );
}

export default LeadsWebsites;
