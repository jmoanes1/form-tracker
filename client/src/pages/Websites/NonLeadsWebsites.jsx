import Dashboard from "../Dashboard";

function NonLeadsWebsites(props) {
  return (
    <Dashboard
      {...props}
      initialTypeFilter="none_leads"
      pageTitle="None Leads Websites"
      pageDescription="Manage and test websites that are not assigned to leads."
    />
  );
}

export default NonLeadsWebsites;
