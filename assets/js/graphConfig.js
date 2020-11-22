// Add here the endpoints for MS Graph API services you would like to use.
const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages",
    graphSharePointLists: "https://graph.microsoft.com/v1.0/sites/892fe68e-73b7-4e17-9605-d2ac73dc2b3a,9e6927cb-2f3e-4189-8f92-f6733f30ff3b/lists",
    graphSharePointListDowntime: "https://graph.microsoft.com/v1.0/sites/892fe68e-73b7-4e17-9605-d2ac73dc2b3a,9e6927cb-2f3e-4189-8f92-f6733f30ff3b/lists/58b85235-91c7-45f4-a44a-0075300be27f/items?expand=columns,items(expand=fields)&$top=10000"
};
