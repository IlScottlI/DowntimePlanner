$(function(){
    $("#gridContainer").dxDataGrid({
        showBorders: true,
        dataSource: {
            store: {
                type: "odata",
                header: {
                    authorization : 'Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6IlVVcGJPLU1OanN3VVN6NE1BWExULU1xQ3duTlk4QWZwd3BaNV8yOXNBeHMiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zNTk2MTkyYi1mZGY1LTRlMmMtYTZmYS1hY2I3MDZjOTYzZDgvIiwiaWF0IjoxNjA1OTgzMDgzLCJuYmYiOjE2MDU5ODMwODMsImV4cCI6MTYwNTk4Njk4MywiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiQVNRQTIvOFJBQUFBWms3dDN6cUZiRWUwUElBWm9xenF5aDdzYXZ6aVVtdmRkbDU2bStTYkxjYz0iLCJhcHBfZGlzcGxheW5hbWUiOiJEb3dudGltZSBQbGFubmVyIiwiYXBwaWQiOiIzMGNlNDYwOC01ZWFkLTQ2ZTMtOGQ5MC1mNWQ4YzBkNDFkMzYiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkpvaG5zb24iLCJnaXZlbl9uYW1lIjoiU2NvdHQiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiI3MS4yMDAuMTE2LjYzIiwibmFtZSI6IkpvaG5zb24sIFNjb3R0Iiwib2lkIjoiMzNmMTUwNmYtZjY4Ny00NjlmLTlmNjAtMGIzMWVkNjVjMzljIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTQzODExMjk0NS0xMzU3Mzg4MTQtOTQ1ODM1MDU1LTkyNzQ1NCIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzQkZGRDlCNUUxMjMwIiwicmgiOiIwLkFRZ0FLeG1XTmZYOUxFNm0tcXkzQnNsajJBaEd6akN0WHVOR2paRDEyTURVSFRZSUFGZy4iLCJzY3AiOiJDaGF0LlJlYWRXcml0ZSBNYWlsLlJlYWQgb3BlbmlkIHByb2ZpbGUgU2l0ZXMuTWFuYWdlLkFsbCBTaXRlcy5SZWFkLkFsbCBTaXRlcy5SZWFkV3JpdGUuQWxsIFVzZXIuUmVhZCBlbWFpbCIsInN1YiI6IlVNdm9xaVpjeDNMZUVVZmpQZjNFOF9FZ3dPYzNwTTJwUmdyZ0Y2cC1EdmciLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiTkEiLCJ0aWQiOiIzNTk2MTkyYi1mZGY1LTRlMmMtYTZmYS1hY2I3MDZjOTYzZDgiLCJ1bmlxdWVfbmFtZSI6ImpvaG5zb24uc2VAcGcuY29tIiwidXBuIjoiam9obnNvbi5zZUBwZy5jb20iLCJ1dGkiOiJ4bmlvV3N5U3dVcTNEaUxmYVU0M0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6IlNKeHJaYWJnT29DRVZuT1l4aHRkb2M0bl9ybG9uM0FITkg2ZURneFE4QjQifSwieG1zX3RjZHQiOjEzNzI0NDAyODl9.nuejOeGYMQBg7GINaodK9-l6XmmIgP3TYSAF8u-1S5gPb17Kno14Vkzr4VAzjjmZLJin8C5v3oMrGLNVamMqBA-dW4RUWCX_g2kUocTpACd3sjzwnAT10RG_xARunDA1DhRbCzCJ2tNDVbrgkB3cC0tExWQucdxhlZstkE7-7nN0Erm5hA4wSeO_tB0HZ8p-xUcLfDVmCp1Ws2LwMmPUrRoyKH7cSJ9m997sxuzoD1hM2EoozMAmWCoL6WfqxSuk2yboxA_ulkFezIA2kOx274bhiscfP7rTKx097vSIjmOw48OEvK4CTtawlCnS26DZ5QiQD8V56rg39v7Pjaprcg'
                },
                url: "https://graph.microsoft.com/v1.0/sites/892fe68e-73b7-4e17-9605-d2ac73dc2b3a,9e6927cb-2f3e-4189-8f92-f6733f30ff3b/lists/58b85235-91c7-45f4-a44a-0075300be27f/items"
            },
            select: [
                "Product_ID",
                "Product_Name",
                "Product_Cost",
                "Product_Sale_Price",
                "Product_Retail_Price",
                "Product_Current_Inventory"
            ],
            filter: ["Product_Current_Inventory", ">", 0]
        },
        columns: [
            "Product_ID", {
                dataField: "Product_Name",
                width: 250
            }, {
                caption: "Cost",
                dataField: "Product_Cost",
                dataType: "number",
                format: "currency"
            }, {
                dataField: "Product_Sale_Price",
                caption: "Sale Price",
                dataType: "number",
                format: "currency"
            }, {
                dataField: "Product_Retail_Price",
                caption: "Retail Price",
                dataType: "number",
                format: "currency"
            }, {
                dataField: "Product_Current_Inventory",
                caption: "Inventory"
            }
        ]
    });
});