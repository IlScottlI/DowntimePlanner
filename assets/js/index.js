var code = 0;
var lang = '';
var userName = "";
var lists = [];
var plants = [];
var businesses = [];
var modules = [];
var departments = [];
var areas = [];
var statuses = [];
var types = [];
var reasons = [];
var selectedModules = [];
var selectedBusinesses = [];
var selectedDepartments = [];
var selectedAreas = [];
var userProfile = {};
var dayOfWeekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var selectedPlantId;
var selectedPlant;
var langs = [];
var langs_datePicker = [];
var langMenuItems = [];


var langListURL = 'https://graph.microsoft.com/v1.0/sites/892fe68e-73b7-4e17-9605-d2ac73dc2b3a,9e6927cb-2f3e-4189-8f92-f6733f30ff3b/lists/57b4fca1-69b5-4e6a-a7c5-312f55425817/items';

var loadChecker = setInterval(() => {
    initlizeLanguage(localStorage.getItem('lang'));
    if ($("#loader").css("display") == 'none') {
        clearInterval(loadChecker);
    }
}, 1)

$(document).ready(() => {
    $('#goBtn').text(getTerm('goBtn'))
})

var meURL = "https://graph.microsoft.com/v1.0/me/";
var siteListsURL =
    "https://graph.microsoft.com/v1.0/sites/892fe68e-73b7-4e17-9605-d2ac73dc2b3a,9e6927cb-2f3e-4189-8f92-f6733f30ff3b/lists/";
var plantListURL,
    businessListURL,
    moduleListURL,
    departmentListURL,
    areaListURL,
    typeListURL,
    reasonsListURL,
    statusListURL,
    downtimeListURL;


var URL = downtimeListURL + "?expand=fields&$orderby=fields/Created desc";
var downtimeStore = new DevExpress.data.CustomStore({
    key: "id",
    load: function () {
        return sendRequest(URL);
    },
    insert: function (values) {
        return sendRequest(URL + "/InsertOrder", "POST", {
            values: JSON.stringify(values),
        });
    },
    update: function (key, values) {
        return sendRequest(URL + "/UpdateOrder", "PUT", {
            key: key,
            values: JSON.stringify(values),
        });
    },
    remove: function (key) {
        return sendRequest(downtimeListURL + `/${key}`, "DELETE");
    },
});

function getAccessToken() {
    let accessToken = [];
    let array = [];
    let token;
    let size;
    for (let i = 0; i < localStorage.length; i++) {
        try {
            accessToken.push({
                token: JSON.parse(localStorage[localStorage.key(i)]).accessToken,
                size: JSON.parse(localStorage[localStorage.key(i)]).accessToken.length,
            });
        } catch (error) { }
    }
    try {
        selectedPlantId = localStorage.getItem('selectedPlantId');
    } catch (error) {
        alertToast(error, 'Failed to Selected Plant information from LocalStorage', 'error');
    }
    accessToken.forEach((element) => {
        array.push(element.size);
    });
    size = Math.max(...array);

    accessToken.forEach((element) => {
        if (element.size == size) {
            token = element.token;
        }
    });

    return `Bearer ${token}`;
}

$(document).on("ready", "mgt-login", function () { });

var testAppearTmr = setInterval(function () {
    if ($("mgt-login").length) {
        clearInterval(testAppearTmr);
        userProfile = $("mgt-login")[0].__userDetails;
    }
}, 500);

function checkToken() {
    let token = getAccessToken();
    $.ajax({
        url: siteListsURL,
        headers: {
            authorization: token,
        },
        success: function (xml, textStatus, xhr) {
            code = xhr.status;
            xhr.responseJSON.value.forEach((element) => {
                lists.push({ name: element.name, id: element.id });
            });
        },
        complete: function (xhr, textStatus) {
            code = xhr.status;
            if (xhr.status != 200) {
                document.querySelector("mgt-login").shadowRoot.querySelector("div > div > button").click();
            }
            getPlants(token);
            getLanguage(token);
        },
    }).done(function (response) {
        if (selectedPlantId) {
            onStart(response, token, selectedPlantId);
        } else if (window.location.pathname != '/DowntimePlanner/switcher.html') {
            window.location = 'switcher.html';
        } else {
            try {
                validatePlantSelected();
            } catch (error) {

            }

        }

    });
}

async function loadJson(url, headers) {
    // (1)
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
            try { plants.forEach((e) => { if (e.id == selectedPlantId) { $('#plantName').text(e.name); selectedPlant = e.name; sessionStorage.setItem('selectedPlant', selectedPlant); getQuestions(); } }) } catch (error) { }
            if (code == 200) {
                clearInterval(loginCheck);
            } else {
                checkToken();
            }
        }, 500);
    }, 500);
});

function validatePlantSelected() {
    if ($('#plantSelector').val() > 0) {
        $('#goBtn').prop('disabled', false);
    } else {
        $('#goBtn').prop('disabled', true);
    }
}

async function getPlants(token) {
    plantListURL =
        siteListsURL +
        lists.filter((obj) => {
            return obj.name == "Plant";
        })[0].id +
        "/items";
    plants = [];
    await loadJson(`${plantListURL}?expand=fields`, {
        headers: { authorization: token },
    })
        .then((res) => {
            res.value.forEach((element) => {
                plants.push({
                    id: element.fields.id,
                    name: element.fields.Title,
                    text: element.fields.Title,
                    lang: element.fields.lang
                });
            });
            sessionStorage.setItem("plants", JSON.stringify(plants));
            let $plantSelected = $('#plantSelector').select2({ language: lang, data: plants, minimumResultsForSearch: Infinity });
            $('#plantSelector').val(selectedPlantId).trigger("change");
            $plantSelected.on("select2:close", function (e) { validatePlantSelected() });
            setTimeout(() => {
                $("#loader").hide();
            }, 500);
        })
        .catch((e) => { alertToast(e, 'Plants SharePoint List', 'error') })
}

async function getLanguage(token) {
    await loadJson(`${langListURL}?expand=fields&$top=1000`, {
        headers: { authorization: token },
    })
        .then((res) => {
            res.value.forEach((element) => {
                langMenuItems.push({ langCode: element.fields.Title, language: element.fields.language })
                let JSON_Data = JSON.parse(element.fields.JSON_Data);
                try {
                    let datePickerJSON = JSON.parse(element.fields.datePicker)
                    langs_datePicker.push({ langCode: element.fields.Title, locale: datePickerJSON.locale });
                } catch (error) {

                }
                JSON_Data.forEach((e) => {
                    langs.push({
                        term: e.term,
                        Title: e.enTrans,
                        langCode: e.langCode,
                        translated: e.translated,
                    });
                })
            });
            sessionStorage.setItem("langs", JSON.stringify(langs));
            $('#langMenu').text('')
            langMenuItems.forEach((e) => {
                $('#langMenu').append(`<a class="dropdown-item text-primary lang" id="${e.langCode}" onClick="initlizeLanguage('${e.langCode}'); window.location = ''; console.log('${e.langCode}')">${e.language}</a>`)
            })
        })
        .catch((e) => { alertToast(e, 'Language SharePoint List', 'error') })
}
function setPlant() {
    sessionStorage.clear();
    selectedPlantId = $('#plantSelector').val();
    plants.forEach((e) => {
        if ($('#plantSelector').val() == e.id) {
            localStorage.setItem('lang', e.lang)
        }
    })
    localStorage.setItem('selectedPlantId', $('#plantSelector').val());
    window.location = 'index.html';
}

function listRollCall() {
    console.log(`Roll Call!`);
    let count = 0;
    if (sessionStorage.plants) {
        count++;
    }
    if (sessionStorage.statuses) {
        count++;
    }
    if (sessionStorage.types) {
        count++;
    }
    if (sessionStorage.reasons) {
        count++;
    }
    if (sessionStorage.businesses) {
        count++;
    }
    if (sessionStorage.modules) {
        count++;
    }
    if (sessionStorage.departments) {
        count++;
    }
    if (sessionStorage.areas) {
        count++;
    }
    return count != 8;
}

async function onStart(response, token, selectedPlantId) {

    if (listRollCall()) {
        await Promise.all([
            response.value.forEach((element) => {
                lists.push({ name: element.name, id: element.id });
            }),
            (downtimeListURL =
                siteListsURL +
                lists.filter((obj) => {
                    return obj.name == "DT_Calendar";
                })[0].id +
                "/items"),
            (plantListURL =
                siteListsURL +
                lists.filter((obj) => {
                    return obj.name == "Plant";
                })[0].id +
                "/items"),
            (plants = []),
            await loadJson(`${plantListURL}?expand=fields`, {
                headers: { authorization: token },
            })
                .then((res) => {
                    res.value.forEach((element) => {
                        plants.push({
                            id: element.fields.id,
                            name: element.fields.Title,
                            text: element.fields.Title,
                            lang: element.fields.lang
                        });
                    });
                    sessionStorage.setItem("plants", JSON.stringify(plants));
                })
                .catch((e) => { alertToast(e, 'Plants SharePoint List', 'error') }),
            (statusListURL =
                siteListsURL +
                lists.filter((obj) => {
                    return obj.name == "Status";
                })[0].id +
                "/items"),
            (statuses = []),
            await loadJson(
                `${statusListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`,
                { headers: { authorization: token } }
            )
                .then((res) => {
                    res.value.forEach((element) => {
                        statuses.push({
                            id: element.fields.id,
                            name: element.fields.Title,
                            text: element.fields.Title,
                            plantId: element.fields.plantId,
                            color: element.fields.color,
                            background: element.fields.background,
                        });
                    });
                    sessionStorage.setItem("statuses", JSON.stringify(statuses));
                })
                .catch((e) => { alertToast(e, 'Statuses SharePoint List', 'error') }),
            (typeListURL =
                siteListsURL +
                lists.filter((obj) => {
                    return obj.name == "Type";
                })[0].id +
                "/items"),
            (types = []),
            await loadJson(
                `${typeListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`,
                { headers: { authorization: token } }
            )
                .then((res) => {
                    res.value.forEach((element) => {
                        types.push({
                            id: element.fields.id,
                            name: element.fields.Title,
                            text: element.fields.Title,
                            plantId: element.fields.plantId,
                        });
                    });
                    sessionStorage.setItem("types", JSON.stringify(types));
                })
                .catch((e) => { alertToast(e, 'Types SharePoint List', 'error') }),
            (reasonListURL =
                siteListsURL +
                lists.filter((obj) => {
                    return obj.name == "Reasons";
                })[0].id +
                "/items"),
            (reasons = []),
            await loadJson(
                `${reasonListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`,
                { headers: { authorization: token } }
            )
                .then((res) => {
                    res.value.forEach((element) => {
                        reasons.push({
                            id: element.fields.id,
                            name: element.fields.Title,
                            text: element.fields.Title,
                            plantId: element.fields.plantId,
                        });
                    });
                    sessionStorage.setItem("reasons", JSON.stringify(reasons));
                })
                .catch((e) => { alertToast(e, 'Reasons SharePoint List', 'error') }),
            (businessListURL =
                siteListsURL +
                lists.filter((obj) => {
                    return obj.name == "Business";
                })[0].id +
                "/items"),
            (businesses = []),
            await loadJson(
                `${businessListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`,
                { headers: { authorization: token } }
            )
                .then((res) => {
                    res.value.forEach((element) => {
                        businesses.push({
                            id: element.fields.id,
                            name: element.fields.Title,
                            text: element.fields.Title,
                            plantId: element.fields.plantId,
                        });
                    });
                    sessionStorage.setItem("businesses", JSON.stringify(businesses));
                })
                .catch((e) => { alertToast(e, 'Businesses SharePoint List', 'error') }),
            (moduleListURL =
                siteListsURL +
                lists.filter((obj) => {
                    return obj.name == "Module";
                })[0].id +
                "/items"),
            (modules = []),
            await loadJson(
                `${moduleListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`,
                { headers: { authorization: token } }
            )
                .then((res) => {
                    res.value.forEach((element) => {
                        modules.push({
                            id: element.fields.id,
                            name: element.fields.Title,
                            text: element.fields.Title,
                            buId: element.fields.buId,
                            plantId: element.fields.plantId,
                        });
                    });
                    sessionStorage.setItem("modules", JSON.stringify(modules));
                })
                .catch((e) => { alertToast(e, 'Modules SharePoint List', 'error') }),
            (departmentListURL =
                siteListsURL +
                lists.filter((obj) => {
                    return obj.name == "Department";
                })[0].id +
                "/items"),
            (departments = []),
            await loadJson(
                `${departmentListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`,
                { headers: { authorization: token, "Content-Type": "application/json" } }
            )
                .then((res) => {
                    res.value.forEach((element) => {
                        departments.push({
                            id: element.fields.id,
                            name: element.fields.Title,
                            text: element.fields.Title,
                            moduleId: element.fields.moduleId,
                            plantId: element.fields.plantId,
                        });
                    });
                    sessionStorage.setItem("departments", JSON.stringify(departments));
                })
                .catch((e) => { alertToast(e, 'Departments SharePoint List', 'error') }),
            (areaListURL =
                siteListsURL +
                lists.filter((obj) => {
                    return obj.name == "Area";
                })[0].id +
                "/items"),
            (areas = []),
            await loadJson(
                `${areaListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`,
                { headers: { authorization: token, "Content-Type": "application/json" } }
            )
                .then((res) => {
                    res.value.forEach((element) => {
                        areas.push({
                            id: element.fields.id,
                            name: element.fields.Title,
                            text: element.fields.Title,
                            deptId: element.fields.deptId,
                            plantId: element.fields.plantId,
                        });
                    });
                    sessionStorage.setItem("areas", JSON.stringify(areas));
                })
                .catch((e) => { alertToast(e, 'Areas SharePoint List', 'error') }),
            getFromStorage(),
            initlizeComboBoxes(),
            buildTable(),
            buildSchedule(),
            plants.forEach((e) => { if (e.id == selectedPlantId) { $('#plantName').text(e.name) } }),
            buildFilters(),
            setTimeout(() => {
                $("#loader").hide();
            }, 500)
        ]);
    }
    else {
        getFromStorage();
        initlizeComboBoxes();
        try { plants.forEach((e) => { if (e.id == selectedPlantId) { $('#plantName').text(e.name) } }) } catch (error) { };
        buildFilters();
        buildTable();
        buildSchedule();
        setTimeout(() => {
            $("#loader").hide();
        }, 500);

    }
}

function initlizeComboBoxes() {
    getFromStorage();
    initlizeBusinesses();
    initlizeModules();
    initlizeDepartments();
    initlizeAreas();
    initlizeType();
    initlizeReason();
    initlizeMaxRows();
    initlizeStatus();
    $('.viewFilter').on('change', () => {
        buildTable();
    })
    initlizeLanguage(localStorage.getItem('lang'));

}

$('.approvals').html(`<span class="badge badge-light approvalCount">0</span>  Approvals`);
$('.approvalCount').text(2);

$('.lang').on('click', (e) => {
    initlizeLanguage(e.target.id);
    window.location = ''
})


function initlizeLanguage(code) {
    localStorage.setItem('lang', code);
    $('.lang').removeClass("text-primary");
    DevExpress.localization.locale(code);
    DevExpress.localization.loadMessages({
        "en": {
            "appTitle": "Downtime Planner"
        },
        "de": {
            "appTitle": "Ausfallzeit Planer"
        },
        "ru": {
            "appTitle": "Планировщик простоев"
        }
    });
    $(".appTitle").text(DevExpress.localization.formatMessage("appTitle"));
    $("title").text(DevExpress.localization.formatMessage("appTitle"));
    $(`#${code}`).addClass("text-primary");
}

function getTerm(term) {
    let code = localStorage.getItem('lang')
    let translated
    langs.forEach((e) => {
        if (e.term == term & e.langCode == code) {
            translated = e.translated
        }
    })
    return translated
}
function getPickerTerm() {
    let locale
    let code = localStorage.getItem('lang')
    langs_datePicker.forEach((e) => {
        if (e.langCode == code) {
            locale = e
        }
    })
    return locale
}

function initlizeMaxRows() {
    $("#filter-maxRows").select2({
        language: lang,
        multiple: false,
        minimumResultsForSearch: Infinity
    });
}

function initlizeStatus() {
    try {
        $("#filter-status-1").select2({
            language: lang,
            data: statuses,
            multiple: true,
            maximumSelectionLength: 1
        });
    } catch (error) { }
}

function initlizeType() {
    try {
        $("#typeSelect").select2({
            language: lang,
            data: types,
            multiple: true,
            maximumSelectionLength: 1
        });
    } catch (error) { }
    try {
        $("#filter-type").select2({
            language: lang,
            data: types,
            multiple: true,
            maximumSelectionLength: 1
        });
    } catch (error) {

    }
}

function initlizeReason() {
    try {
        $("#reasonSelect").select2({
            language: lang,
            data: reasons,
            multiple: true,
            maximumSelectionLength: 1
        });
    } catch (error) { }
    try {
        $("#filter-reason").select2({
            language: lang,
            data: reasons,
            multiple: true,
            maximumSelectionLength: 1
        });
    } catch (error) { }
}

function initlizeBusinesses() {
    try {
        $("#buSelect").select2({
            language: lang,
            data: businesses,
            multiple: true,
        });
        $("#buSelect").on("change", function (e) {
            initlizeModules();
            initlizeDepartments();
            initlizeAreas();
        });
    } catch (error) { }
    try {
        $("#filter-business").select2({
            language: lang,
            data: businesses,
            multiple: true,
        });
        $("#filter-business").on("change", function (e) {
            initlizeModules();
            initlizeDepartments();
            initlizeAreas();
        });
    } catch (error) { }
}

function initlizeModules() {
    selectedModules = [];
    try {
        $("#moduleSelect").val(null).trigger("change");
    } catch (error) { }
    try {
        let array = $("#buSelect").select2("data");
        array.forEach((ele_a) => {
            modules.forEach((ele_b) => {
                if (ele_a.id == ele_b.buId) {
                    selectedModules.push(ele_b);
                }
            });
        });
        $("#moduleSelect").select2({
            language: lang,
            data: selectedModules,
            multiple: true,
        });
        $("#moduleSelect").on("change", function (e) {
            initlizeDepartments();
            initlizeAreas();
        });
    } catch (error) { }
    try {
        $("#filter-module").val(null).trigger("change");
    } catch (error) { }
    try {
        let array = $("#filter-business").select2("data");
        array.forEach((ele_a) => {
            modules.forEach((ele_b) => {
                if (ele_a.id == ele_b.buId) {
                    selectedModules.push(ele_b);
                }
            });
        });
        $("#filter-module").select2({
            language: lang,
            data: selectedModules,
            multiple: true,
        });
        $("#filter-module").on("change", function (e) {
            initlizeDepartments();
            initlizeAreas();
        });
    } catch (error) { }
}

function initlizeDepartments() {
    selectedDepartments = [];
    try {
        $("#deptSelect").val(null).trigger("change");
    } catch (error) { }
    try {
        let array = $("#moduleSelect").select2("data");
        array.forEach((ele_a) => {
            departments.forEach((ele_b) => {
                if (ele_a.id == ele_b.moduleId) {
                    selectedDepartments.push(ele_b);
                }
            });
        });
        $("#deptSelect").select2({
            language: lang,
            data: selectedDepartments,
            multiple: true,
        });
        $("#deptSelect").on("change", function (e) {
            initlizeAreas();
        });
    } catch (error) { }
    try {
        $("#deptSelect").val(null).trigger("change");
    } catch (error) { }
    try {
        let array = $("#filter-module").select2("data");
        array.forEach((ele_a) => {
            departments.forEach((ele_b) => {
                if (ele_a.id == ele_b.moduleId) {
                    selectedDepartments.push(ele_b);
                }
            });
        });
        $("#filter-department").select2({
            language: lang,
            data: selectedDepartments,
            multiple: true,
        });
        $("#filter-department").on("change", function (e) {
            initlizeAreas();
        });
    } catch (error) { }
}

function initlizeAreas() {
    selectedAreas = [];
    try {
        $("#areaSelect").val(null).trigger("change");
    } catch (error) { }
    try {
        let array = $("#deptSelect").select2("data");
        array.forEach((ele_a) => {
            areas.forEach((ele_b) => {
                if (ele_a.id == ele_b.deptId) {
                    selectedAreas.push(ele_b);
                }
            });
        });
        $("#areaSelect").select2({
            language: lang,
            data: selectedAreas,
            multiple: true,
        });
        $("#areaSelect").on("change", function (e) { });
    } catch (error) { }
    try {
        $("#filter-area").val(null).trigger("change");
    } catch (error) { }
    try {
        let array = $("#filter-department").select2("data");
        array.forEach((ele_a) => {
            areas.forEach((ele_b) => {
                if (ele_a.id == ele_b.deptId) {
                    selectedAreas.push(ele_b);
                }
            });
        });
        $("#filter-area").select2({
            language: lang,
            data: selectedAreas,
            multiple: true,
        });
        $("#filter-area").on("change", function (e) { });
    } catch (error) { }
}

function alertToast(e, title, type, skipTimeout) {
    let color;
    console.log(e);
    switch (type) {
        case 'error':
            color = 'bg-danger'
            break;
        case 'success':
            color = 'bg-success'
            break;
        default:
            color = 'bg-info';
            break;
    }
    let id = Date.now();
    let item = `
    <div role="alert" class="toast ${color} fade show" id="${id}">
        <div class="toast-header">
            <strong class="mr-auto">${title}</strong><small>${type}</small>
            <button class="close ml-2 mb-1 close" onclick="remove(${id})">
                <span aria-hidden="true">×</span>
            </button>
        </div>
        <div role="alert" class="toast-body">
            <p>${e}</p>
        </div>
    </div>
`;
    if (!skipTimeout) {
        setTimeout(() => {
            remove(id);
        }, 5000);
    }


    $('#toastPanel').append(item);
    var toastPanel = setInterval(() => {
        $('#toastPanel').css({ display: "block" });
        if ($('#toastPanel').length < 1) {
            $('#toastPanel').css({ display: "none" });
            clearInterval(toastPanel);
        }
    }, 250);
}

function remove(id) {
    $(`#${id}`).remove();
}

function getFromStorage() {
    try {
        plants = JSON.parse(sessionStorage.getItem("plants"));
    } catch (e) {
        alertToast(e, 'Failed to load plants from SessionStorage', 'error');
    }
    try {
        statuses = JSON.parse(sessionStorage.getItem("statuses"));
    } catch (e) {
        alertToast(e, 'Failed to load statuses from SessionStorage', 'error');
    }
    try {
        types = JSON.parse(sessionStorage.getItem("types"));
    } catch (e) {
        alertToast(e, 'Failed to load types from SessionStorage', 'error');
    }
    try {
        reasons = JSON.parse(sessionStorage.getItem("reasons"));
    } catch (e) {
        alertToast(e, 'Failed to load reasons from SessionStorage', 'error');
    }
    try {
        businesses = JSON.parse(sessionStorage.getItem("businesses"));
    } catch (e) {
        alertToast(e, 'Failed to load businesses from SessionStorage', 'error');
    }
    try {
        modules = JSON.parse(sessionStorage.getItem("modules"));
    } catch (e) {
        alertToast(e, 'Failed to load modules from SessionStorage', 'error');
    }
    try {
        departments = JSON.parse(sessionStorage.getItem("departments"));
    } catch (e) {
        alertToast(e, 'Failed to load departments from SessionStorage', 'error');
    }
    try {
        areas = JSON.parse(sessionStorage.getItem("areas"));
    } catch (e) {
        alertToast(e, 'Failed to load areas from SessionStorage', 'error');
    }
}