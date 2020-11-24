
function buildTable() {

    var selectedPlantId = 1;
    var token = getAccessToken();
    var dataGrid = $("#gridContainer").dxDataGrid({
        dataSource: new DevExpress.data.CustomStore({
            key: "id",
            loadMode: "odata", // omit in the DataGrid, TreeList, PivotGrid, and Scheduler
            load: async function () {
                var result = []
                await loadJson(`${downtimeListURL}?expand=fields&$filter=fields/plantId eq '${selectedPlantId}'`, { headers: { authorization: token } })
                    .then((res) => {
                        res.value.forEach(element => {
                            result.push({
                                id: element.fields.id,
                                Title: element.fields.Title,
                                buId: element.fields.buId,
                                plantId: element.fields.plantId,
                                startDate: element.fields.startDate,
                                endDate: element.fields.endDate,
                                moduleId: element.fields.moduleId,
                                deptId: element.fields.deptId,
                                areaId: element.fields.areaId,
                                typeId: element.fields.typeId,
                                statusId: element.fields.statusId,
                                Owner: element.fields.Owner,
                                Approvers: element.fields.Approvers
                            });
                        });
                    })
                return result
            },

            byKey: async function (key) {
                var result = []
                await loadJson(`${downtimeListURL}/${key}`, { headers: { authorization: token } })
                    .then((res) => {
                        res.value.forEach(element => {
                            result.push({
                                id: element.fields.id,
                                Title: element.fields.Title,
                                buId: element.fields.buId,
                                plantId: element.fields.plantId,
                                startDate: element.fields.startDate,
                                endDate: element.fields.endDate,
                                moduleId: element.fields.moduleId,
                                deptId: element.fields.deptId,
                                areaId: element.fields.areaId,
                                typeId: element.fields.typeId,
                                statusId: element.fields.statusId,
                                Owner: element.fields.Owner,
                                Approvers: element.fields.Approvers
                            });
                        });
                    })
                return result
            },

            insert: function (values) {
                return $.ajax({
                    url: downtimeListURL,
                    method: "POST",
                    data: JSON.stringify({
                        "fields": { ...values, plantId: '1' }
                    }),
                    headers: { authorization: token, "Content-Type": "application/json" },
                });
            },

            update: function (key, values) {
                return $.ajax({
                    url: downtimeListURL + `/${key}/fields`,
                    method: "PATCH",
                    data: JSON.stringify(values),
                    headers: { authorization: token, "Content-Type": "application/json" },
                });
            },

            remove: function (key) {
                return $.ajax({
                    url: downtimeListURL + `/${key}`,
                    method: "DELETE",
                    headers: { authorization: token },
                });
            }

        }),
        remoteOperations: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        columnsAutoWidth: true,
        focusedRowEnabled: true,
        filterPanel: { visible: true },
        hoverStateEnabled: true,
        paging: {
            pageSize: 10
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 25, 50, 100]
        },
        remoteOperations: false,
        searchPanel: {
            visible: true,
            highlightCaseSensitive: true
        },
        groupPanel: { visible: true },
        grouping: {
            autoExpandAll: false
        },
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        headerFilter: {
            visible: true
        },
        sorting: {
            mode: "multiple"
        },
        editing: {
            mode: "form",
            allowUpdating: true,
            allowDeleting: true,
            allowAdding: true
        },
        columns: [
            {
                dataField: "Title",
                caption: "Project Name",
                minwidth: 180
            },
            {
                minwidth: 100,
                dataField: "startDate",
                dataType: "datetime",
                cellTemplate: function (element, info) {
                    element.append(`<small> ${moment(info.text).format('lll')} </small>`);
                }
            },
            {
                minwidth: 100,
                dataField: "endDate",
                dataType: "datetime",
                cellTemplate: function (element, info) {
                    element.append(`<small> ${moment(info.text).format('lll')} </small>`);
                }
            },
            {
                dataField: "moduleId",
                caption: "Module",
                setCellValue: function (rowData, value) {
                    rowData.moduleId = value;
                    rowData.deptId = null;
                    rowData.areaId = null;
                },
                lookup: {
                    dataSource: modules,
                    valueExpr: "id",
                    displayExpr: "name"
                }
            },
            {
                dataField: "deptId",
                caption: "Department",
                setCellValue: function (rowData, value) {
                    rowData.deptId = value;
                    rowData.areaId = null;
                },
                lookup: {
                    dataSource: function (options) {
                        return {
                            store: departments,
                            filter: options.data ? ["moduleId", "=", options.data.moduleId] : null
                        };
                    },
                    valueExpr: "id",
                    displayExpr: "name"
                }
            }, {
                dataField: "areaId",
                caption: "Area",
                lookup: {
                    dataSource: function (options) {
                        return {
                            store: areas,
                            filter: options.data ? ["deptId", "=", options.data.deptId] : null
                        };
                    },
                    valueExpr: "id",
                    displayExpr: "name"
                }
            }, {
                dataField: "typeId",
                caption: "Type",
                lookup: {
                    dataSource: types,
                    valueExpr: "id",
                    displayExpr: "name"
                }
            }, {
                dataField: "statusId",
                caption: "Status",
                lookup: {
                    dataSource: statuses,
                    valueExpr: "id",
                    displayExpr: "name"
                }
            }, {
                minwidth: 100,
                dataField: "Owner",
                caption: "Downtime Owner",
                cellTemplate: function (element, info) {
                    element.append(`<div> ${info.value} </div>`);
                }
            },
        ],
    }).dxDataGrid("instance");


};


function getTaskDataItem(row) {
    const rowData = row && row.data;
    const taskItem = {
        subject: "",
        description: "",
        status: "",
        progress: ""
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