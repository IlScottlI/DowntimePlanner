var token = getAccessToken();
getFromStorage();
function getTaskDataItem(row) {
    const rowData = row && row.data;
    const taskItem = {
        subject: "",
        description: "",
        status: "",
        progress: "",
    };
    if (rowData) {
        taskItem.subject = rowData.Task_Subject;
        taskItem.description = rowData.Task_Description;
        taskItem.status = rowData.Task_Status;
        if (rowData.Task_Completion) {
            taskItem.progress = rowData.Task_Completion + "%";
        }
    }
    return taskItem;
}

function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== "";
}

var store = new DevExpress.data.CustomStore({
    key: "id",
    load: function (loadOptions) {
        var deferred = $.Deferred(),
            startDate, endDate, urlString, typeIds, reasonIds, statusIds;
        ["filter"].forEach(function (i) {
            if (i in loadOptions && isNotEmpty(loadOptions[i]))
                try {
                    typeIds = "";
                    if ($("#filter-type").val().length > 0) {
                        typeIds = ` and fields/typeId eq '${$("#filter-type").val()}'`;
                    }
                    reasonIds = "";
                    if ($("#filter-reason").val().length > 0) {
                        reasonIds = ` and fields/reasonId eq '${$("#filter-reason").val()}'`;
                    }
                    statusIds = "";
                    if ($("#filter-status-1").val().length > 0) {
                        statusIds = ` and fields/statusId eq '${$("#filter-status-1").val()}'`;
                    }
                } catch (error) {

                }
            try {
                startDate = moment(loadOptions[i][0][4][0][1]).format('YYYY-MM-DD HH:mm');
                endDate = moment(loadOptions[i][0][0][1][2]).format('YYYY-MM-DD HH:mm');
            } catch (error) {

            }

            switch (window.location.pathname) {
                case "/DowntimePlanner/scheduler.html":
                    urlString = `${downtimeListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'${statusIds}${reasonIds}${typeIds} and fields/endDate gt '${startDate}' and fields/startDate lt '${endDate}' or startswith(fields/recurrenceRule,'FREQ')${statusIds}${reasonIds}${typeIds} and fields/plantId eq '${selectedPlantId}'`;
                    break;

                default:
                    urlString = urlBuilder();
                    break;
            }
        });
        $.ajax({
            url: urlString,
            dataType: "json",
            headers: { authorization: token },
            success: function (res) {
                let resultArr = [];
                res.value.forEach((element) => {
                    if ($("#filter-area").val().length > 0) {
                        let count = 0;
                        $("#filter-area").val().forEach(el => {
                            try {
                                JSON.parse(element.fields.areaId).forEach(ement => {
                                    if (el == ement) {
                                        count++
                                    }
                                });
                            } catch (error) { }
                        });

                        if (count > 0) {
                            resultArr.push({
                                id: element.fields.id,
                                index: element.fields.id,
                                text: element.fields.Title,
                                Title: element.fields.Title,
                                buId: element.fields.buId,
                                plantId: element.fields.plantId,
                                startDate: element.fields.startDate,
                                endDate: element.fields.endDate,
                                moduleId: element.fields.moduleId,
                                deptId: element.fields.deptId,
                                areaId: element.fields.areaId,
                                areaIds: element.fields.areaId,
                                typeId: element.fields.typeId,
                                statusId: element.fields.statusId,
                                Owner: element.fields.Owner,
                                Approvers: element.fields.Approvers,
                                recurrenceRule: element.fields.recurrenceRule,
                                recurrenceException: element.fields.recurrenceException
                            });
                        }
                    } else if ($("#filter-department").val().length > 0) {
                        let count = 0;
                        $("#filter-department").val().forEach(el => {
                            try {
                                JSON.parse(element.fields.deptId).forEach(ement => {
                                    if (el == ement) {
                                        count++
                                    }
                                });
                            } catch (error) { }
                        });

                        if (count > 0) {
                            resultArr.push({
                                id: element.fields.id,
                                index: element.fields.id,
                                text: element.fields.Title,
                                Title: element.fields.Title,
                                buId: element.fields.buId,
                                plantId: element.fields.plantId,
                                startDate: element.fields.startDate,
                                endDate: element.fields.endDate,
                                moduleId: element.fields.moduleId,
                                deptId: element.fields.deptId,
                                areaId: element.fields.areaId,
                                areaIds: element.fields.areaId,
                                typeId: element.fields.typeId,
                                statusId: element.fields.statusId,
                                Owner: element.fields.Owner,
                                Approvers: element.fields.Approvers,
                                recurrenceRule: element.fields.recurrenceRule,
                                recurrenceException: element.fields.recurrenceException
                            });
                        }
                    } else if ($("#filter-module").val().length > 0) {
                        let count = 0;
                        $("#filter-module").val().forEach(el => {
                            try {
                                JSON.parse(element.fields.moduleId).forEach(ement => {
                                    if (el == ement) {
                                        count++
                                    }
                                });
                            } catch (error) { }
                        });

                        if (count > 0) {
                            resultArr.push({
                                id: element.fields.id,
                                index: element.fields.id,
                                text: element.fields.Title,
                                Title: element.fields.Title,
                                buId: element.fields.buId,
                                plantId: element.fields.plantId,
                                startDate: element.fields.startDate,
                                endDate: element.fields.endDate,
                                moduleId: element.fields.moduleId,
                                deptId: element.fields.deptId,
                                areaId: element.fields.areaId,
                                areaIds: element.fields.areaId,
                                typeId: element.fields.typeId,
                                statusId: element.fields.statusId,
                                Owner: element.fields.Owner,
                                Approvers: element.fields.Approvers,
                                recurrenceRule: element.fields.recurrenceRule,
                                recurrenceException: element.fields.recurrenceException
                            });
                        }
                    } else if ($("#filter-business").val().length > 0) {
                        let count = 0;
                        $("#filter-business").val().forEach(el => {
                            try {
                                JSON.parse(element.fields.buId).forEach(ement => {
                                    if (el == ement) {
                                        count++
                                    }
                                });
                            } catch (error) { }
                        });

                        if (count > 0) {
                            resultArr.push({
                                id: element.fields.id,
                                index: element.fields.id,
                                text: element.fields.Title,
                                Title: element.fields.Title,
                                buId: element.fields.buId,
                                plantId: element.fields.plantId,
                                startDate: element.fields.startDate,
                                endDate: element.fields.endDate,
                                moduleId: element.fields.moduleId,
                                deptId: element.fields.deptId,
                                areaId: element.fields.areaId,
                                areaIds: element.fields.areaId,
                                typeId: element.fields.typeId,
                                statusId: element.fields.statusId,
                                Owner: element.fields.Owner,
                                Approvers: element.fields.Approvers,
                                recurrenceRule: element.fields.recurrenceRule,
                                recurrenceException: element.fields.recurrenceException
                            });
                        }
                    } else {
                        resultArr.push({
                            id: element.fields.id,
                            index: element.fields.id,
                            text: element.fields.Title,
                            Title: element.fields.Title,
                            buId: element.fields.buId,
                            plantId: element.fields.plantId,
                            startDate: element.fields.startDate,
                            endDate: element.fields.endDate,
                            moduleId: element.fields.moduleId,
                            deptId: element.fields.deptId,
                            areaId: element.fields.areaId,
                            areaIds: element.fields.areaId,
                            typeId: element.fields.typeId,
                            statusId: element.fields.statusId,
                            Owner: element.fields.Owner,
                            Approvers: element.fields.Approvers,
                            recurrenceRule: element.fields.recurrenceRule,
                            recurrenceException: element.fields.recurrenceException
                        });
                    }
                });
                deferred.resolve(resultArr, { totalCount: result.length });
            },
            error: function (e) {
                alertToast(JSON.stringify(e), "Table Error", "error", true);
                deferred.reject("Data Loading Error");
            },
            timeout: 5000,
        });
        setTimeout(() => {
            $("#loader").hide();
        }, 500);
        return deferred.promise();
    },
});

function buildTable() {

    try {
        // buildTemp();
        buildSchedule();
    } catch (error) {

    }
    $("#gridContainer")
        .dxDataGrid({
            dataSource: store,
            remoteOperations: true,
            showColumnLines: true,
            showRowLines: true,
            rowAlternationEnabled: true,
            showBorders: true,
            columnsAutoWidth: true,
            focusedRowEnabled: false,
            filterPanel: { visible: false },
            filterValue: filterBuilder(),
            hoverStateEnabled: true,
            allowColumnResizing: true,
            columnResizingMode: "nextColumn",
            paging: {
                pageSize: 25,
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 25, 50, 100, 500],
            },
            remoteOperations: false,
            searchPanel: {
                visible: true,
            },
            groupPanel: { visible: false },
            grouping: {
                autoExpandAll: false,
            },
            allowColumnReordering: true,
            rowAlternationEnabled: true,
            filterRow: {
                visible: false,
            },
            headerFilter: {
                visible: false,
            },
            sorting: {
                mode: "multiple",
            },
            columnChooser: {
                enabled: false,
            },
            columns: [
                {
                    dataField: "buId",
                    caption: "",
                    visible: false,
                },
                {
                    dataField: "index",
                    caption: "",
                    width: 25,
                    cellTemplate: function (element, info) {
                        element.append(
                            `<a href="request.html?id=${info.value}" onclick="setBackTo(window.location.pathname.split('/')[2])"><i class="fa fa-pencil" style="color: #96938e;"></i></a>`
                        );
                    },
                },
                {
                    dataField: "Title",
                    caption: "Project Name",
                    cellTemplate: function (element, info) {
                        element.append(
                            `<span class="badge badge-light">${info.text} </span>`
                        );
                    },
                },
                {
                    dataField: "startDate",
                    dataType: "datetime",
                    cellTemplate: function (element, info) {
                        element.append(
                            `<span class="badge badge-light"> ${moment(info.text).format(
                                "lll"
                            )} </span>`
                        );
                    },
                },
                {
                    dataField: "endDate",
                    dataType: "datetime",
                    cellTemplate: function (element, info) {
                        element.append(
                            `<span class="badge badge-light"> ${moment(info.text).format(
                                "lll"
                            )} </span>`
                        );
                    },
                },
                {
                    dataField: "moduleId",
                    caption: "Module",
                    cellTemplate: function (element, info) {
                        let res = [];
                        try {
                            JSON.parse(info.value).forEach((el) => {
                                element.append(
                                    `<span class="badge badge-light">${lookUp(
                                        modules,
                                        el,
                                        "name"
                                    )}</span>`
                                );
                            });
                        } catch (error) { }
                    },
                },
                {
                    dataField: "deptId",
                    caption: "Department",
                    cellTemplate: function (element, info) {
                        let res = [];
                        try {
                            JSON.parse(info.value).forEach((el) => {
                                element.append(
                                    `<span class="badge badge-light">${lookUp(
                                        departments,
                                        el,
                                        "name"
                                    )}</span>`
                                );
                            });
                        } catch (error) { }
                    },
                },
                {
                    dataField: "areaId",
                    caption: "Area",
                    cellTemplate: function (element, info) {
                        try {
                            JSON.parse(info.value).forEach((el) => {
                                element.append(
                                    `<span class="badge badge-light">${lookUp(
                                        areas,
                                        el,
                                        "name"
                                    )}</span>`
                                );
                            });
                        } catch (error) { }
                    },
                },
                {
                    dataField: "typeId",
                    caption: "Type",
                    width: 100,
                    cellTemplate: function (element, info) {
                        try {
                            info.value.split(",").forEach((el) => {
                                element.append(
                                    `<span class="badge badge-light">${lookUp(
                                        types,
                                        el,
                                        "name"
                                    )}</span>`
                                );
                            });
                        } catch (error) { }
                    },
                },
                {
                    dataField: "statusId",
                    caption: "Status",
                    width: 100,
                    cellTemplate: function (element, info) {
                        let res = [];
                        try {
                            info.value.split(",").forEach((el) => {
                                res.push(lookUp(statuses, el, "name"));
                            });
                        } catch (error) { }
                        element.append(
                            `<a onclick="setBackTo(window.location.pathname.split('/')[2])" href="request.html?id=${info.key
                            }" style="margin: 0px; padding:0px; color:${lookUp(
                                statuses,
                                info.value,
                                "color"
                            )}; background-color:${lookUp(
                                statuses,
                                info.value,
                                "background"
                            )}" class="badge p-1 pl-3 pr-3 w-100">${res.join(",")}</a>`
                        );
                    },
                },
                {
                    dataField: "Owner",
                    caption: "Downtime Owner",
                    cellTemplate: function (element, info) {
                        element.append(
                            `<span class="badge badge-light">${info.text} </span>`
                        );
                    },
                },
                {
                    dataField: "id",
                    caption: "",
                    width: 20,
                    cellTemplate: function (element, info) {
                        element.append(
                            `<a href="request.html?id=${info.value}" onclick="setBackTo(window.location.pathname.split('/')[2])"><i class="fa fa-chevron-right" style="color: #96938e;"></i></a>`
                        );
                    },
                },
            ],
        })
        .dxDataGrid("instance");
}

function setBackTo(backTo) {
    sessionStorage.setItem("backTo", backTo);
}

function navBack() {
    window.location = sessionStorage.getItem("backTo");
    sessionStorage.removeItem("backTo");
}

function lookUp(array, id, prop) {
    for (var i = 0; i < array.length; i++) {
        if (array[i]["id"] == id) {
            if (array[i].hasOwnProperty(prop) === true) {
                return array[i][prop];
            } else {
                return "";
            }
        }
    }
    return "";
}

function buildFilters() {
    $("#filter-startDate").val(moment().format("YYYY-MM-DD"));
    $("#filter-endDate").val(moment().add(30, "days").format("YYYY-MM-DD"));
}

function urlBuilder() {
    let dateStart, dateEnd, typeIds, reasonIds, statusIds;
    let string = `${downtimeListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`;
    dateStart = '';
    // if ($("#filter-startDate").val().length > 0) {
    //     dateStart = ` and fields/minDate ge '${Date.parse($('#filter-startDate').val())}'`;
    // }
    dateEnd = '';
    // if ($("#filter-endDate").val().length > 0) {
    //     dateEnd = ` and fields/endDate le '${$("#filter-endDate").val()}'`;
    // }
    typeIds = "";
    if ($("#filter-type").val().length > 0) {
        typeIds = ` and fields/typeId eq '${$("#filter-type").val()}'`;
    }
    reasonIds = "";
    if ($("#filter-reason").val().length > 0) {
        reasonIds = ` and fields/reasonId eq '${$("#filter-reason").val()}'`;
    }
    statusIds = "";
    if ($("#filter-status-1").val().length > 0) {
        statusIds = ` and fields/statusId eq '${$("#filter-status-1").val()}'`;
    }
    // if ($("#filter-maxRows").val().length > 0) {
    //     maxRows = `&$top=${$("#filter-maxRows").val()}`;
    // }

    return (
        string + dateStart + dateEnd + typeIds + reasonIds + statusIds + '&$orderby=fields/startDate'
    );
}

function filterBuilder() {
    try {
        let buFilter = [
            ["buId", "contains", $("#filter-business").val()],
            "or",
            ["buId", "contains", ""],
        ];
        if ($("#filter-business").val().length > 0) {
            buFilter = [];
            $("#filter-business")
                .val()
                .forEach((element) => {
                    buFilter.push(["buId", "contains", element]);
                    buFilter.push("or");
                });
        }

        let moduleFilter = [
            ["moduleId", "contains", $("#filter-business").val()],
            "or",
            ["moduleId", "contains", ""],
        ];
        if ($("#filter-module").val().length > 0) {
            moduleFilter = [];
            $("#filter-module")
                .val()
                .forEach((element) => {
                    moduleFilter.push(["moduleId", "contains", element]);
                    moduleFilter.push("or");
                });
        }

        let deptFilter = [
            ["deptId", "contains", $("#filter-department").val()],
            "or",
            ["deptId", "contains", ""],
        ];
        if ($("#filter-department").val().length > 0) {
            deptFilter = [];
            $("#filter-department")
                .val()
                .forEach((element) => {
                    deptFilter.push(["deptId", "contains", element]);
                    deptFilter.push("or");
                });
        }

        let areaFilter = [
            ["areaId", "contains", $("#filter-area").val()],
            "or",
            ["areaId", "contains", ""],
        ];
        if ($("#filter-area").val().length > 0) {
            areaFilter = [];
            $("#filter-area")
                .val()
                .forEach((element) => {
                    areaFilter.push(["areaId", "contains", element]);
                    areaFilter.push("or");
                });
        }

        return [
            buFilter,
            "and",
            moduleFilter,
            "and",
            deptFilter,
            "and",
            areaFilter,
        ];
    } catch (error) { }
}

function buildSchedule() {
    switch (window.location.pathname) {
        case "/DowntimePlanner/scheduler.html":
            $("#scheduler")
                .dxScheduler({
                    dataSource: store,
                    views: ["week", "month"],
                    currentView: "month",
                    firstDayOfWeek: 0,
                    startDayHour: 0,
                    endDayHour: 23,
                    showAllDayPanel: false,
                    height: 600,
                    crossScrollingEnabled: true,
                    remoteFiltering: true,
                    showCurrentTimeIndicator: true,
                    shadeUntilCurrentTime: true,
                    editing: {
                        allowAdding: false,
                        allowDragging: false
                    },
                    resources: [
                        {
                            fieldExpr: "statusId",
                            allowMultiple: false,
                            dataSource: statuses,
                            colorExpr: 'background',
                            label: "Status"
                        },

                    ],
                    onAppointmentClick: function (e) {
                        $("#loader").show();
                        setBackTo(window.location.pathname.split('/')[2]);
                        window.location = `request.html?id=${e.appointmentData.id}`;
                    },
                    onAppointmentDblClick: function (e) {
                        $("#loader").show();
                        setBackTo(window.location.pathname.split('/')[2]);
                        window.location = `request.html?id=${e.appointmentData.id}`;
                    }
                })
                .dxScheduler("instance");

            break;

        default:
            buildTimeline();
            break;
    }


}

function buildTimeline() {
    $("#scheduler")
        .dxScheduler({
            dataSource: store,
            views: ["agenda", "timelineDay", "timelineWeek", "timelineWorkWeek", "timelineMonth"],
            currentView: "agenda",
            firstDayOfWeek: 0,
            startDayHour: 0,
            endDayHour: 23,
            showAllDayPanel: false,
            height: 600,
            crossScrollingEnabled: true,
            remoteFiltering: true,
            showCurrentTimeIndicator: true,
            shadeUntilCurrentTime: true,
            editing: {
                allowAdding: false,
                allowDragging: false
            },
            resources: [
                {
                    fieldExpr: "statusId",
                    allowMultiple: false,
                    dataSource: statuses,
                    colorExpr: 'background',
                    label: "Status"
                },

            ],
            onAppointmentClick: function (e) {
                $("#loader").show();
                setBackTo(window.location.pathname.split('/')[2]);
                window.location = `request.html?id=${e.appointmentData.id}`;
            },
            onAppointmentDblClick: function (e) {
                $("#loader").show();
                setBackTo(window.location.pathname.split('/')[2]);
                window.location = `request.html?id=${e.appointmentData.id}`;
            }
        })
        .dxScheduler("instance");

}



