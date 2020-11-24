var code = 0;
var userName = '';
var lists = [];
var plants = [];
var businesses = [];
var modules = [];
var departments = [];
var areas = [];
var statuses = [];
var types = [];
var reasons = [];

var userProfile = {};

var meURL = 'https://graph.microsoft.com/v1.0/me/';
var siteListsURL = "https://graph.microsoft.com/v1.0/sites/892fe68e-73b7-4e17-9605-d2ac73dc2b3a,9e6927cb-2f3e-4189-8f92-f6733f30ff3b/lists/";
var plantListURL, businessListURL, moduleListURL, departmentListURL, areaListURL, typeListURL, reasonsListURL, statusListURL, downtimeListURL;

var URL = downtimeListURL + '?expand=fields&$orderby=fields/Created desc';
var downtimeStore = new DevExpress.data.CustomStore({
    key: "id",
    load: function () {
        return sendRequest(URL);
    },
    insert: function (values) {
        return sendRequest(URL + "/InsertOrder", "POST", {
            values: JSON.stringify(values)
        });
    },
    update: function (key, values) {
        return sendRequest(URL + "/UpdateOrder", "PUT", {
            key: key,
            values: JSON.stringify(values)
        });
    },
    remove: function (key) {
        return sendRequest(downtimeListURL + `/${key}`, "DELETE",);
    }
});




function getAccessToken() {
    let accessToken = [];
    let array = [];
    let token;
    let size;
    for (let i = 0; i < localStorage.length; i++) {
        try {
            accessToken.push({ token: JSON.parse(localStorage[localStorage.key(i)]).accessToken, size: JSON.parse(localStorage[localStorage.key(i)]).accessToken.length });
        } catch (error) {

        }

    }
    accessToken.forEach(element => {
        array.push(element.size)
    });
    size = Math.max(...array);

    accessToken.forEach(element => {
        if (element.size == size) {
            token = element.token;
        }
    });

    return `Bearer ${token}`;
}

switch (window.location.pathname) {
    case '/view.html':

        break;

    default:

        let userId;
        $(document).ready(function () {
            setTimeout(() => {
                try {
                    userId = $('mgt-login')[0].__userDetails.id;
                    $('#peoplePicker1').html(`<mgt-people-picker default-selected-user-ids="${userId}"> </mgt-people-picker>`);

                } catch (error) {

                }
            }, 300);

        });
        break;
}
$(document).on("ready", "mgt-login", function () {
});
var testAppearTmr = setInterval(function () {
    if ($('mgt-login').length) {
        clearInterval(testAppearTmr);
        userProfile = $('mgt-login')[0].__userDetails;
    }
}, 250);


function checkToken() {
    let token = getAccessToken();
    let selectedPlantId = '1';
    $.ajax({
        "url": siteListsURL,
        "headers": {
            "authorization": token
        },
        success: function (xml, textStatus, xhr) {
            code = xhr.status;
        },
        complete: function (xhr, textStatus) {
            code = xhr.status;
            if (xhr.status != 200) {
                document.querySelector("body > nav.navbar.navbar-dark.navbar-expand-md.bg-dark > div > mgt-login ").shadowRoot.querySelector("div > div > button").click();
            }
        }
    }).done(function (response) {
        onStart(response, getAccessToken(), '1')
    })
}


async function loadJson(url, headers) { // (1)
    let response = await fetch(url, headers); // (2)

    if (response.status == 200) {
        let json = await response.json(); // (3)

        return json;
    }

    throw new Error(response.status);
}

$(window).on("load", function () {
    setTimeout(() => {
        var loginCheck = setInterval(() => {
            if (code == 200) {
                clearInterval(loginCheck);
            } else {
                checkToken();
            }
        }, 200);
    }, 500);
});

function getItems(url, plantId, deptId) {
    let token = getAccessToken();
    let res;
    $('#loader').show();
    $.ajax({
        url: `${url}?expand=fields&$filter=fields/plantId eq '${plantId}' and fields/deptId eq '${deptId}'`,
        headers: {
            authorization: token
        },
        success: function (xml, textStatus, xhr) {
            if (xhr.status == 200) {
                $('#loader').hide();
            }
        },
        complete: function (xhr, textStatus) {
            return res = xhr.responseJSON;
        }
    });
}





async function onStart(response, token, selectedPlantId) {
    await Promise.all([
        lists = [],
        response.value.forEach(element => {
            lists.push({ name: element.name, id: element.id });
        }),
        downtimeListURL = siteListsURL + lists.filter(obj => { return obj.name == "DT_Calendar" })[0].id + "/items",
        plantListURL = siteListsURL + lists.filter(obj => { return obj.name == "Plant" })[0].id + "/items",
        plants = [],
        await loadJson(`${plantListURL}?expand=fields`, { headers: { authorization: token } })
            .then((res) => {
                res.value.forEach(element => {
                    plants.push({
                        id: element.fields.id,
                        name: element.fields.Title
                    })
                });
            })
            .catch(alert),
        statusListURL = siteListsURL + lists.filter(obj => { return obj.name == "Status" })[0].id + "/items",
        statuses = [],
        await loadJson(`${statusListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`, { headers: { authorization: token } })
            .then((res) => {
                res.value.forEach(element => {
                    statuses.push({
                        id: element.fields.id,
                        name: element.fields.Title,
                        plantId: element.fields.plantId
                    })
                });
            })
            .catch(alert),
        typeListURL = siteListsURL + lists.filter(obj => { return obj.name == "Type" })[0].id + "/items",
        types = [],
        await loadJson(`${typeListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`, { headers: { authorization: token } })
            .then((res) => {
                res.value.forEach(element => {
                    types.push({
                        id: element.fields.id,
                        name: element.fields.Title,
                        plantId: element.fields.plantId
                    })
                });
            })
            .catch(alert),
        reasonListURL = siteListsURL + lists.filter(obj => { return obj.name == "Reasons" })[0].id + "/items",
        reasons = [],
        await loadJson(`${reasonListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`, { headers: { authorization: token } })
            .then((res) => {
                res.value.forEach(element => {
                    reasons.push({
                        id: element.fields.id,
                        name: element.fields.Title,
                        plantId: element.fields.plantId
                    })
                });
            })
            .catch(alert),
        businessListURL = siteListsURL + lists.filter(obj => { return obj.name == "Business" })[0].id + "/items",
        businesses = [],
        await loadJson(`${businessListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`, { headers: { authorization: token } })
            .then((res) => {
                res.value.forEach(element => {
                    businesses.push({
                        id: element.fields.id,
                        name: element.fields.Title,
                        plantId: element.fields.plantId
                    })
                });
            })
            .catch(alert),
        moduleListURL = siteListsURL + lists.filter(obj => { return obj.name == "Module" })[0].id + "/items",
        modules = [],
        await loadJson(`${moduleListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`, { headers: { authorization: token } })
            .then((res) => {
                res.value.forEach(element => {
                    modules.push({
                        id: element.fields.id,
                        name: element.fields.Title,
                        buId: element.fields.buId,
                        plantId: element.fields.plantId
                    })
                });
            })
            .catch(alert),
        departmentListURL = siteListsURL + lists.filter(obj => { return obj.name == "Department" })[0].id + "/items",
        departments = [],
        await loadJson(`${departmentListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`, { headers: { authorization: token, 'Content-Type': "application/json" } })
            .then((res) => {
                res.value.forEach(element => {
                    departments.push({
                        id: element.fields.id,
                        name: element.fields.Title,
                        moduleId: element.fields.moduleId,
                        plantId: element.fields.plantId
                    })
                });
            })
            .catch(alert),
        areaListURL = siteListsURL + lists.filter(obj => { return obj.name == "Area" })[0].id + "/items",
        areas = [],
        await loadJson(`${areaListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`, { headers: { authorization: token, 'Content-Type': "application/json" } })
            .then((res) => {
                res.value.forEach(element => {
                    areas.push({
                        id: element.fields.id,
                        name: element.fields.Title,
                        deptId: element.fields.deptId,
                        plantId: element.fields.plantId
                    })
                });
            })
            .catch(alert),
        buildTable(),
        $('#loader').hide()
    ]);
}