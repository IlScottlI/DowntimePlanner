var month = [];
var recurrenceRule = { FREQ: "", BYDAY: "", COUNT: "", UNTIL: "", INTERVAL: "", BYMONTHDAY: "", BYMONTH: "" };
var selectedRequest = {};
var result = {};
var questionsList = [];
var freq = [];
$.urlParam = function (name) {
  try {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
      window.location.href
    );
    return results[1] || 0;
  } catch (error) { }
};

downtimeListURL = "https://graph.microsoft.com/v1.0/sites/892fe68e-73b7-4e17-9605-d2ac73dc2b3a,9e6927cb-2f3e-4189-8f92-f6733f30ff3b/lists/f39a4bd4-9ca3-42fb-97c8-70b53b5922ff/items";

switch (window.location.pathname) {
  case "/DowntimePlanner/request.html":
    initilizeRepeat();
    if ($.urlParam("id")) {
      waitForLists($.urlParam("id"));
    } else {
      waitForLists();
    }
    break;

  default:
    break;
}

async function getListItem(id) {
  await loadJson(`${downtimeListURL}/${id}`, {
    headers: { authorization: getAccessToken() },
  })
    .then((res) => {
      selectedRequest = res.fields;
    })
    .catch((e) => {
      alertToast(e, "Failed to Get Requested Item", "error");
    });
  return selectedRequest;
}

async function getQuestions() {
  questionsList = [];
  selectedPlant = sessionStorage.getItem('selectedPlant');
  questionsListURL = `https://graph.microsoft.com/v1.0/sites/892fe68e-73b7-4e17-9605-d2ac73dc2b3a,9e6927cb-2f3e-4189-8f92-f6733f30ff3b/lists/d20a4d58-ee3b-470c-a081-f2b015f1eea1/items?expand=fields&$filter=fields/ConfigSite eq '${selectedPlant}'`;
  await loadJson(questionsListURL, {
    headers: { authorization: getAccessToken() },
  })
    .then((res) => {
      res.value.forEach(el => {
        questionsList.push({
          id: el.fields.id,
          required: el.fields.Title,
          ConfigType: el.fields.ConfigType,
          ConfigQuestion: el.fields.ConfigQuestion,
          lines: el.fields.Number_x0020_of_x0020_lines_x002,
          LinkLevel: el.fields.LinkLevel,
          buiDs: el.fields.BusinessSelected
        })
      });

    })
    .catch((e) => {
      alertToast(e, "Failed to Get Questions for " + selectedPlant, "error");
    });
  return questionsList;
}

function waitForLists(id) {
  var loadChecker = setInterval(() => {
    if ($("#loader").css("display") == 'none') {
      if (id) {
        editForm(id);
        $('#submitBtn').hide();
        $('#updateBtn').show();
        $('#tabTitle').html(`${getTerm('editDTrequest')}: <strong class="badge badge-light">${$.urlParam("id")}</strong>`);
        $('#navOptions').show();
      } else {
        newForm();
        $('#submitBtn').show();
        $('#updateBtn').hide();
        setInterval(() => {
          $('#tabTitle').text();
        }, 1);
        initilizeRepeat();
      }
      clearInterval(loadChecker);
    }
  }, 250);
}

async function editForm(id) {
  initilizeRepeat();
  await getListItem(id);
  let buIds, moduleIds, deptIds, areaIds;
  try {
    buIds = JSON.parse(selectedRequest.buId);
  } catch (error) {
    buIds = selectedRequest.buId;
  }
  try {
    moduleIds = JSON.parse(selectedRequest.moduleId);
  } catch (error) {
    moduleIds = selectedRequest.moduleId;
  }
  try {
    deptIds = JSON.parse(selectedRequest.deptId);
  } catch (error) {
    deptIds = selectedRequest.deptId;
  }
  try {
    areaIds = JSON.parse(selectedRequest.areaId);
  } catch (error) {
    areaIds = selectedRequest.areaId;
  }
  $('#form-Title').val(selectedRequest.Title)
  document.querySelector("#form-Owner").selectUsersById([selectedRequest.Owner]);
  $('#buSelect').val(buIds).trigger('change');
  $('#moduleSelect').val(moduleIds).trigger('change');
  $('#deptSelect').val(deptIds).trigger('change');
  $('#areaSelect').val(areaIds).trigger('change');
  $('#typeSelect').val(selectedRequest.typeId).trigger('change');
  $('#reasonSelect').val(selectedRequest.reasonId).trigger('change');
  $('#form-eventStart').val(moment(selectedRequest.endDate).format("YYYY-MM-DDThh:mm"));
  $('#form-eventEnd').val(moment(selectedRequest.startDate).format("YYYY-MM-DDThh:mm"));
  initilizeDatePickers(selectedRequest.startDate, selectedRequest.endDate);
  $('#form-Repeat').prop("checked", () => { try { return selectedRequest.recurrenceRule.length > 0 } catch (error) { return false } });
  try {
    if (selectedRequest.recurrenceRule.length > 0) {
      initilizeRepeat();
      $('#repeatRow').show();
      let string = selectedRequest.recurrenceRule;
      let table = string.split(";").map(pair => pair.split("="));
      result = {};
      table.forEach(([key, value]) => result[key] = value);
      $('#form-repeatFreq').val(result["FREQ"]).trigger('change');
      if (result["INTERVAL"]) {
        $('#interval').val(result["INTERVAL"]);
        calRepeat();
      }
      if (result["UNTIL"]) {
        $('#form-onCheck').prop('checked', true);
        $('#form-endOn').prop("disabled", false);
        $('#form-afterCheck').prop("disabled", true);
        initilizeDatePickers(selectedRequest.startDate, selectedRequest.endDate, moment(`${result["UNTIL"].slice(0, 4)}-${result["UNTIL"].slice(4, 6)}-${result["UNTIL"].slice(6, 8)}`));
        calRepeat();
      }
      if (result["BYDAY"]) {
        $('.weekday').removeClass('btn-primary btn-light');
        $('.weekday').addClass('btn-light');
        result["BYDAY"].split(',').forEach(element => {
          $(`#${element}`).toggleClass('btn-light')
          $(`#${element}`).toggleClass('btn-primary')
        });
        calRepeat();
      }
      if (result["COUNT"]) {
        $('#form-endOn').prop("disabled", true);
        $('#form-afterCheck').prop("disabled", false);
        $('#form-after-btn').prop('checked', true);
        $('#form-afterCheck').val(result["COUNT"]);
        calRepeat();
      }
      if (result['BYMONTH']) {
        $('#form-YearlyMonth').val(result['BYMONTH']).trigger('change');
      }
      if (result['BYMONTHDAY']) {
        $('#form-YearlyDay').val(result['BYMONTHDAY']);
      }
    }

  } catch (error) {
    // alertToast(error, 'Oh Snap!', 'error');
  }
  // Approvers: 'johnson.se@pg.com;rosenlof.r@pg.com'
  // recurrenceRule: $('#repeatString').val()
}

function newForm() {
  getUser();
  initilizeRepeat();
  initilizeDatePickers();

}

function initilizeDatePickers(start, end, repeatEnd) {
  if (start) {
    let loopstart = setInterval(() => {
      try {
        $('#form-eventStart').daterangepicker({
          "timePicker": true,
          singleDatePicker: true,
          showDropdowns: true,
          "timePicker24Hour": true,
          "locale": getPickerTerm().locale,
          "startDate": moment(start)
        })
        $('#form-eventEnd').daterangepicker({
          "timePicker": true,
          singleDatePicker: true,
          showDropdowns: true,
          "timePicker24Hour": true,
          "locale": getPickerTerm().locale,
          "startDate": moment(end)
        })
        $('#form-endOn').daterangepicker({
          "timePicker": false,
          singleDatePicker: true,
          showDropdowns: true,
          "locale": getPickerTerm().locale,
          "startDate": moment(repeatEnd)
        })
        if (getPickerTerm().locale) {
          clearInterval(loopstart)
        }
      } catch (error) {

      }
    }, 100);
  } else {
    let loop = setInterval(() => {
      try {
        $('#form-eventStart').daterangepicker({
          "timePicker": true,
          singleDatePicker: true,
          showDropdowns: true,
          "timePicker24Hour": true,
          "locale": getPickerTerm().locale,
          "startDate": moment()
        })
        $('#form-eventEnd').daterangepicker({
          "timePicker": true,
          singleDatePicker: true,
          showDropdowns: true,
          "timePicker24Hour": true,
          "locale": getPickerTerm().locale,
          "startDate": moment().add(4, "hours")
        })
        $('#form-endOn').daterangepicker({
          "timePicker": false,
          singleDatePicker: true,
          showDropdowns: true,
          "locale": getPickerTerm().locale,
          "startDate": moment()
        })
        if (getPickerTerm().locale) {
          clearInterval(loop)
        }
      } catch (error) {

      }
    }, 100);
  }
}

function getUser() {
  var testAppearTmr = setInterval(function () {
    if ($("mgt-login").length) {
      clearInterval(testAppearTmr);
      (userProfile = $("mgt-login")[0].__userDetails),
        document
          .querySelector("#form-Owner")
          .selectUsersById([userProfile.mail]);
    }
  }, 250);
}

function changeFrequency(val) {
  switch (val) {
    case "HOURLY":
      $("#everyLabel").text(getTerm('hours'));
      $("#form-weekly").hide();
      $("#form-yearly").hide();
      break;
    case "DAILY":
      $("#everyLabel").text(getTerm('days'));
      $("#form-weekly").hide();
      $("#form-yearly").hide();
      break;
    case "WEEKLY":
      $("#everyLabel").text(getTerm('weeks'));
      $("#form-weekly").show();
      $("#form-yearly").hide();
      break;
    case "MONTHLY":
      $("#everyLabel").text(getTerm('months'));
      $("#form-weekly").hide();
      $("#form-yearly").hide();
      break;
    case "YEARLY":
      $("#everyLabel").text(getTerm('years'));
      $("#form-yearly").show();
      $("#form-weekly").hide();
      break;
    default:
      $("#everyLabel").text("");
      $("#form-weekly").hide();
      $("#form-yearly").hide();
      break;
  }
}

function checkWeekday() {
  let weekday = moment().format("dd").toUpperCase();
  if ($("#form-weeklyRepeat > .btn-primary").length < 1) {
    $(`#${weekday}`).toggleClass("btn-primary");
    $(`#${weekday}`).toggleClass("btn-light");
  }
}

function initilizeRepeat() {
  $('input').on("change", () => {
    calRepeat();
  })
  $("#form-weeklyRepeat > button").click(function () {
    $(this).toggleClass("btn-primary");
    $(this).toggleClass("btn-light");
  });
  $("#form-repeatFreq").select2({ language: lang, minimumResultsForSearch: Infinity, data: freq });
  $("#repeatRow").hide();
  $("#form-endOn").prop("disabled", true);
  $("#form-endOn").val(moment().format("YYYY-MM-DD"));
  $("#form-afterCheck").prop("disabled", true);
  $("#form-eventStart").val(moment().format("YYYY-MM-DDThh:mm"));
  $("#form-eventEnd").val(moment().add(4, "hours").format("YYYY-MM-DDThh:mm"));
  $("input#form-Repeat").on("click", function () {
    if ($("#form-Repeat:checked").val()) {
      $("#repeatRow").show();
    } else {
      $("#repeatRow").hide();
    }
  });

  $("#form-YearlyMonth").select2({
    language: lang,
    minimumResultsForSearch: Infinity,
    data: month,
  });
  $("#form-YearlyMonth").val(moment().format("M")).trigger("change");

  $('#form-YearlyDay').val(moment().format("D"));
  checkWeekday();

}

function calRepeat() {
  $('#repeatString').val('');
  recurrenceRule = { FREQ: "", BYDAY: "", COUNT: "", UNTIL: "", INTERVAL: "", BYMONTHDAY: "", BYMONTH: "" };
  if ($('#form-Repeat:checked').val() == null) return;
  let key = $('#form-repeatFreq').val();
  let string = `FREQ=${key}`;
  recurrenceRule.FREQ = key;
  switch (key) {
    case "HOURLY":
      if ($('#interval').val() > 1) {
        string += `;INTERVAL=${$('#interval').val()}`;
        recurrenceRule.INTERVAL = $('#interval').val();
      }
      if ($('#form-onCheck:checked').val()) {
        string += `;UNTIL=${moment($('#form-endOn').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).utc().format('YYYYMMDDTHHmmss')}Z`;
        recurrenceRule.UNTIL = moment($('#form-endOn').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).utc().format('YYYYMMDDTHHmmss') + "Z";
      }
      if ($('#form-after-btn:checked').val()) {
        string += `;COUNT=${$('#form-afterCheck').val()}`;
        recurrenceRule.COUNT = $('#form-afterCheck').val();
      }
      break;
    case "DAILY":
      if ($('#interval').val() > 1) {
        string += `;INTERVAL=${$('#interval').val()}`;
        recurrenceRule.INTERVAL = $('#interval').val();
      }
      if ($('#form-onCheck:checked').val()) {
        string += `;UNTIL=${moment($('#form-endOn').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).utc().format('YYYYMMDDTHHmmss')}Z`;
        recurrenceRule.UNTIL = moment($('#form-endOn').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).utc().format('YYYYMMDDTHHmmss') + "Z";
      }
      if ($('#form-after-btn:checked').val()) {
        string += `;COUNT=${$('#form-afterCheck').val()}`;
        recurrenceRule.COUNT = $('#form-afterCheck').val();
      }
      break;
    case "WEEKLY":
      if ($('#interval').val() > 1) {
        string += `;INTERVAL=${$('#interval').val()}`;
        recurrenceRule.INTERVAL = $('#interval').val();
      } if ($('.weekday.btn-primary').length > 0) {
        let arr = [];
        for (let i = 0; i < $('.weekday.btn-primary').length; i++) {
          const element = $('.weekday.btn-primary')[i].id;
          arr.push(element);
        }
        string += `;BYDAY=${arr.join(',')}`;
        recurrenceRule.BYDAY = arr.join(',');
      }
      if ($('#form-onCheck:checked').val()) {
        string += `;UNTIL=${moment($('#form-endOn').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).utc().format('YYYYMMDDTHHmmss')}Z`;
        recurrenceRule.UNTIL = moment($('#form-endOn').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).utc().format('YYYYMMDDTHHmmss') + "Z";
      }
      if ($('#form-after-btn:checked').val()) {
        string += `;COUNT=${$('#form-afterCheck').val()}`;
        recurrenceRule.COUNT = $('#form-afterCheck').val();
      }
      break;
    case "MONTHLY":
      if ($('#interval').val() > 1) {
        string += `;INTERVAL=${$('#interval').val()}`;
        recurrenceRule.INTERVAL = $('#interval').val();
      }
      if ($('#form-onCheck:checked').val()) {
        string += `;UNTIL=${moment($('#form-endOn').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).utc().format('YYYYMMDDTHHmmss')}Z`;
        recurrenceRule.UNTIL = moment($('#form-endOn').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).utc().format('YYYYMMDDTHHmmss') + "Z";
      }
      if ($('#form-after-btn:checked').val()) {
        string += `;COUNT=${$('#form-afterCheck').val()}`;
        recurrenceRule.COUNT = $('#form-afterCheck').val();
      }
      break;
    case "YEARLY":
      if ($('#interval').val() > 1) {
        string += `;INTERVAL=${$('#interval').val()}`;
        recurrenceRule.INTERVAL = $('#interval').val();
      }
      if ($("#form-YearlyMonth").val() > 0) {
        string += `;BYMONTHDAY=${$("#form-YearlyDay").val()};BYMONTH=${$("#form-YearlyMonth").val()}`
        recurrenceRule.BYMONTHDAY = $("#form-YearlyDay").val();
        recurrenceRule.BYMONTH = $("#form-YearlyMonth").val();
      }
      if ($('#form-onCheck:checked').val()) {
        string += `;UNTIL=${moment($('#form-endOn').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).utc().format('YYYYMMDDTHHmmss')}Z`;
        recurrenceRule.UNTIL = moment($('#form-endOn').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).utc().format('YYYYMMDDTHHmmss') + "Z";
      }
      if ($('#form-after-btn:checked').val()) {
        string += `;COUNT=${$('#form-afterCheck').val()}`;
        recurrenceRule.COUNT = $('#form-afterCheck').val();
      }
      break;

  }
  $('#repeatString').val(string);

}

function submitForm() {
  $("#loader").show();
  let token = getAccessToken();
  let buId, moduleId, deptId, areaId;
  try {
    buId = JSON.stringify($('#buSelect').val())
  } catch (error) {
    buId = $('#buSelect').val()
  }
  try {
    moduleId = JSON.stringify($('#moduleSelect').val())
  } catch (error) {
    moduleId = $('#moduleSelect').val()
  }
  try {
    deptId = JSON.stringify($('#deptSelect').val())
  } catch (error) {
    deptId = $('#deptSelect').val()
  }
  try {
    areaId = JSON.stringify($('#areaSelect').val())
  } catch (error) {
    areaId = $('#areaSelect').val()
  }
  let data = {
    Title: $('#form-Title').val(),
    Owner: document.querySelector('#form-Owner').selectedPeople[0].userPrincipalName,
    plantId: selectedPlantId,
    buId: buId,
    moduleId: moduleId,
    deptId: deptId,
    areaId: areaId,
    typeId: $('#typeSelect').val().join(','),
    reasonId: $('#reasonSelect').val().join(','),
    statusId: '1',
    Approvers: 'johnson.se@pg.com;rosenlof.r@pg.com',
    startDate: moment($('#form-eventStart').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).format('YYYY-MM-DD HH:mm'),
    endDate: moment($('#form-eventEnd').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).format('YYYY-MM-DD HH:mm'),
    recurrenceRule: $('#repeatString').val(),
    FREQ: recurrenceRule.FREQ,
    BYDAY: recurrenceRule.BYDAY,
    COUNT: recurrenceRule.COUNT,
    UNTIL: recurrenceRule.UNTIL,
    INTERVAL: recurrenceRule.INTERVAL,
    BYMONTHDAY: recurrenceRule.BYMONTHDAY,
    BYMONTH: recurrenceRule.BYMONTH
  }
  $.ajax({
    url: downtimeListURL,
    method: "POST",
    data: JSON.stringify({
      "fields": { ...data }
    }),
    headers: { authorization: token, "Content-Type": "application/json" },
  }).then((e) => {
    if (e.id > 0) {
      setTimeout(() => {
        window.location = 'index.html';
        alertToast('', 'Form Submit Successfully', 'success');
      }, 1000);
    } else {
      alertToast(e.responseText, 'Form Submit Failed', 'error'); $("#loader").hide();
    }
  });



}

function updateForm() {
  // Modal Popup Here
  $("#loader").show();
  let token = getAccessToken();
  let id = $.urlParam("id")
  let data = {
    Title: $('#form-Title').val(),
    Owner: document.querySelector('#form-Owner').selectedPeople[0].userPrincipalName,
    plantId: selectedPlantId,
    buId: JSON.stringify($('#buSelect').val()),
    moduleId: JSON.stringify($('#moduleSelect').val()),
    deptId: JSON.stringify($('#deptSelect').val()),
    areaId: JSON.stringify($('#areaSelect').val()),
    typeId: $('#typeSelect').val().join(','),
    reasonId: $('#reasonSelect').val().join(','),
    statusId: '1',
    Approvers: '',
    startDate: moment($('#form-eventStart').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).format('YYYY-MM-DD HH:mm'),
    endDate: moment($('#form-eventEnd').val(), getPickerTerm(localStorage.getItem('lang')).locale.format).format('YYYY-MM-DD HH:mm'),
    recurrenceRule: $('#repeatString').val(),
    FREQ: recurrenceRule.FREQ,
    BYDAY: recurrenceRule.BYDAY,
    COUNT: recurrenceRule.COUNT,
    UNTIL: recurrenceRule.UNTIL,
    INTERVAL: recurrenceRule.INTERVAL,
    BYMONTHDAY: recurrenceRule.BYMONTHDAY,
    BYMONTH: recurrenceRule.BYMONTH
  }
  $.ajax({
    url: downtimeListURL + '/' + id,
    method: "PATCH",
    data: JSON.stringify({
      "fields": { ...data }
    }),
    headers: { authorization: token, "Content-Type": "application/json" },
  }).catch((e) => { alertToast(e, 'Form Submit Failed', 'error'); $("#loader").hide(); return });

  alertToast('', 'Form Submit Successfully', 'success');
  setTimeout(() => {
    navBack();
  }, 100);

}

function getTemplate(id, visible, question, type) {
  let response
  if (visible == true) { visible = 'block' } else { visible = 'none' }
  switch (type) {
    case 'Yes/No':
      response = `
      <div class="col-6">
          <div class="card-group">
              <div class="card">
                  <div class="card-body" style="background-color: rgba(0,0,0,0.05);"><sub class="d-block float-left mr-3 mt-2" style="display:${visible}">*</sub><label>${question}</label>
                      <div class="form-group align-content-around">
                          <div class="form-check d-inline-block w-25 ml-3"><input type="radio" class="form-check-input" id="${id}-yes" name="${id}-bool" /><label class="form-check-label" for="${id}-yes">Yes</label></div>
                          <div class="form-check d-inline-block w-25"><input type="radio" class="form-check-input" id="${id}-no" name="${id}-bool" /><label class="form-check-label" for="${id}-no">No</label></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      `
      break;

    default:
      break;
  }
  return response;
}

