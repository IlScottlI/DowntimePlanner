// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

let accessToken;
let username = "";
let downtime = [];
let dtTable = [];

// Redirect: once login is successful and redirects with tokens, call Graph API
myMSALObj.handleRedirectPromise().then(handleResponse).catch(err => {
  console.error(err);
});

function handleResponse(resp) {
  if (resp !== null) {
    username = resp.account.username;
    showWelcomeMessage(resp.account);
    $('#loader').hide()
  } else {
    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    const currentAccounts = myMSALObj.getAllAccounts();
    if (currentAccounts === null) {
      return;
    } else if (currentAccounts.length > 1) {
      // Add choose account code here
      console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
      username = currentAccounts[0].username;
      showWelcomeMessage(currentAccounts[0]);

    }
  }
}

function signIn() {
  myMSALObj.loginRedirect(loginRequest);
}

function signOut() {
  const logoutRequest = {
    account: myMSALObj.getAccountByUsername(username)
  };

  myMSALObj.logout(logoutRequest);
}

function getTokenRedirect(request) {
  /**
   * See here for more info on account retrieval: 
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */
  request.account = myMSALObj.getAccountByUsername(username);
  return myMSALObj.acquireTokenSilent(request).catch(error => {
    console.warn("silent token acquisition fails. acquiring token using redirect");
    if (error instanceof msal.InteractionRequiredAuthError) {
      // fallback to interaction when silent call fails
      return myMSALObj.acquireTokenRedirect(request);
    } else {
      console.warn(error);
    }
  });
}

function seeProfile() {
  getTokenRedirect(loginRequest).then(response => {
    callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, updateUI);
    profileButton.classList.add('d-none');
    mailButton.classList.remove('d-none');
  }).catch(error => {
    console.error(error);
  });
}

function readMail() {
  getTokenRedirect(tokenRequest).then(response => {
    callMSGraph(graphConfig.graphMailEndpoint, response.accessToken, updateUI);
  }).catch(error => {
    console.error(error);
  });
}

function readLists() {
  getTokenRedirect(tokenRequest).then(response => {
    callMSGraph(graphConfig.graphSharePointLists, response.accessToken, updateUI);
  }).catch(error => {
    console.error(error);
  });
}

function readLists() {
  getTokenRedirect(tokenRequest)
    .then((response) => {
      callMSGraph(
        graphConfig.graphSharePointLists,
        response.accessToken,
        updateUI
      );
    })
    .catch((error) => {
      console.error(error);
    });
  readDowntime();
}

function readDowntime() {
  downtime = [];
  dtTable = [];
  getTokenRedirect(tokenRequest)
    .then((response) => {
      callMSGraph(
        graphConfig.graphSharePointListDowntime,
        response.accessToken,
        (res) => {
          if (res["@odata.nextLink"]) {
            res.value.forEach(element => {
              downtime.push(element);
              element.fields.dtOwnerMail = element.createdBy.user.email;
              element.fields.dtOwnerDisplayName = element.createdBy.user.displayName;
              dtTable.push(element.fields);
            });
            loopList(res["@odata.nextLink"]);
          } else {
            res.value.forEach(element => {
              downtime.push(element);
              dtTable.push(element.fields);
            });
          }
          buildTable();
        }
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

function loopList(listURL) {
  getTokenRedirect(tokenRequest).then((response) => {
    callMSGraph(listURL, response.accessToken, (res) => {
      if (res["@odata.nextLink"]) {
        res.value.forEach(element => {
          downtime.push(element);
          dtTable.push(element.fields);
        });
        loopList(res["@odata.nextLink"]);
        buildTable();
      } else {
        res.value.forEach(element => {
          downtime.push(element);
          dtTable.push(element.fields);
        });
        buildTable();
      }
    });
  });
}

signIn();

function buildTable() {
  try {
    buildSchedule()
  } catch (error) {

  }

  $(function () {
    var dataGrid = $("#gridContainer").dxDataGrid({
      dataSource: dtTable,
      keyExpr: "id",
      columnsAutoWidth: true,
      showBorders: true,
      hoverStateEnabled: true,
      allowColumnReordering: true,
      allowColumnResizing: true,
      filterPanel: { visible: true },
      editing: {
        mode: "popup",
        allowUpdating: true,
        popup: {
          title: "Downtime Request",
          showTitle: true,
          width: '80%',
          height: '90%',
          position: {
            my: "top",
            at: "top",
            of: window
          }
        },
        form: {
          items: [{
            itemType: "group",
            colCount: 1,
            colSpan: 2,
            items: ["Title"]
          },
          {
            itemType: "group",
            colCount: 2,
            colSpan: 2,
            items: ["EventDate", "_x0066_vj0", "knkh", "w1b1", "xpkd", "Status", {
              dataField: "Notes",
              editorType: "dxTextArea",
              colSpan: 2,
              editorOptions: {
                height: 100
              }
            }]
          }, {
            itemType: "group",
            colCount: 2,
            colSpan: 2,
            caption: "Home Address",
            items: ["StateID", "Address"]
          }]
        }
      },
      selection: {
        mode: "single"
      },
      filterRow: {
        visible: true,
        applyFilter: "auto"
      },
      // filterValue:[["EventDate",">=",'Sat Nov 21 2020 18:35:00 GMT-0500 (Eastern Standard Time)']],
      groupPanel: {
        visible: true
      },
      stateStoring: {
        enabled: false,
        type: "localStorage",
        storageKey: "storage"
      },
      pager: {
        allowedPageSizes: [10, 15, 30, 50, 100],
        showInfo: true,
        showNavigationButtons: true,
        showPageSizeSelector: true,
        visible: true
      },
      searchPanel: {
        visible: true,
        width: 240,
        placeholder: "Search..."
      },
      headerFilter: {
        visible: true
      },
      columns: [{
        dataField: "Title",
        caption: "Project",
        width: 400,
      }, {
        dataField: "EventDate",
        alignment: "right",
        dataType: "datetime",
        caption: "Start",
        width: 180,
        format: "M/d/yyyy, HH:mm"
      }, {
        dataField: "_x0066_vj0",
        alignment: "right",
        dataType: "datetime",
        caption: "End",
        width: 180,
        format: "M/d/yyyy, HH:mm"
      }, {
        dataField: "knkh",
        alignment: "right",
        caption: "Module",
        headerFilter: {
          allowSearch: true
        },
        width: 180
      }, {
        caption: "Department",
        dataField: "w1b1",
        headerFilter: {
          allowSearch: true
        },
        width: 180
      }, {
        caption: "Area",
        dataField: "xpkd",
        headerFilter: {
          allowSearch: true
        },
        width: 180
      }, {
        caption: "Type",
        dataField: "_x006a_186",
        headerFilter: {
          allowSearch: true
        },
        width: 180
      }, {
        caption: "Status",
        dataField: "Status",
        width: 180
      }, {
        caption: "DT Owner",
        dataField: "dtOwnerMail"
      }]
    }).dxDataGrid('instance');

    var applyFilterTypes = [{
      key: "auto",
      name: "Immediately"
    }, {
      key: "onClick",
      name: "On Button Click"
    }];

    var applyFilterModeEditor = $("#useFilterApplyButton").dxSelectBox({
      items: applyFilterTypes,
      value: applyFilterTypes[0].key,
      valueExpr: "key",
      displayExpr: "name",
      onValueChanged: function (data) {
        dataGrid.option("filterRow.applyFilter", data.value);
      }
    }).dxSelectBox("instance");

    $("#filterRow").dxCheckBox({
      text: "Filter Row",
      value: true,
      onValueChanged: function (data) {
        dataGrid.clearFilter();
        dataGrid.option("filterRow.visible", data.value);
        applyFilterModeEditor.option("disabled", !data.value);
      }
    });

    $("#headerFilter").dxCheckBox({
      text: "Header Filter",
      value: true,
      onValueChanged: function (data) {
        dataGrid.clearFilter();
        dataGrid.option("headerFilter.visible", data.value);
      }
    });

    function getOrderDay(rowData) {
      return (new Date(rowData.OrderDate)).getDay();
    }
  });


}

async function f() {

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done!"), 1000)
  });

  let result = await promise; // wait until the promise resolves (*)

  console.log(result); // "done!"
}

f();