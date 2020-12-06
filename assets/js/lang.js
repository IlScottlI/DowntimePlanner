

$(document).ready(() => {
    lang = localStorage.getItem('lang')
    var count = 1000
    var langLoop = setInterval(() => {
        $('.select2-results__message').text(getTerm('itemsNotFound'))
        $('#goBtn').text(getTerm('goBtn'))
        $('.appTitle').text(getTerm('appTitle'))
        $('.newRequest').html('<i class="fa fa-plus d-inline-block mr-2" style="color: #96938e;"></i>' + getTerm('newRequest'))
        $('.viewRequest').html('<i class="fa fa-bars d-inline-block mr-2" style="color: #96938e;"></i>' + getTerm('viewRequest'))
        $('.dtCalendar').html('<i class="fa fa-calendar d-inline-block mr-2" style="color: #96938e;"></i>' + getTerm('dtCalendar'))
        $('.dtDashboard').html('<i class="fa fa-bar-chart d-inline-block mr-2" style="color: #96938e;"></i>' + getTerm('dtDashboard'))
        $('.approvals').html('<span class="badge badge-secondary approvalCount mr-2">0</span>' + getTerm('approvals'))
        $('.projectName').text('*  ' + getTerm('projectName'))
        $('.dtOwner').text('*  ' + getTerm('dtOwner'))
        $('.business').text('*  ' + getTerm('business'))
        $('.module').text(getTerm('module'))
        $('.department').text(getTerm('department'))
        $('.area').text(getTerm('area'))
        $('.requestType').text('*  ' + getTerm('requestType'))
        $('.dtReasonCode').text('*  ' + getTerm('dtReasonCode'))
        $('.dateStart').text('*  ' + getTerm('dateStart'))
        $('.dateEnd').text('*  ' + getTerm('dateEnd'))
        $('.frequency').text(getTerm('frequency'))
        $('.every').text(getTerm('every'))
        $('.endRepeat').text(getTerm('endRepeat'))
        $('.never').text(getTerm('never'))
        $('.on').text(getTerm('on'))
        $('.after').text(getTerm('after'))
        $('.repeatOn').text(getTerm('repeatOn'))
        $('.sun').text(getTerm('sun'))
        $('.mon').text(getTerm('mon'))
        $('.tue').text(getTerm('tue'))
        $('.wed').text(getTerm('wed'))
        $('.thu').text(getTerm('thu'))
        $('.fri').text(getTerm('fri'))
        $('.sat').text(getTerm('sat'))
        $('.back').text(getTerm('back'))
        $('#updateBtn').text(getTerm('updateBtn'))
        $('#submitBtn').text(getTerm('submitBtn'))
        changeFrequency($('#form-repeatFreq').val());
        $('.back').text(getTerm('back'))
        $('.status').text(getTerm('status'))
        $('.type').text(getTerm('type'))
        $('.dtReason').text(getTerm('dtReason'))
        $('.business').text(getTerm('business'))
        $('.module').text(getTerm('module'))
        $('.department').text(getTerm('department'))
        $('.area').text(getTerm('area'))

        month = [
            { id: 1, text: getTerm('jan') },
            { id: 2, text: getTerm('feb') },
            { id: 3, text: getTerm('mar') },
            { id: 4, text: getTerm('apr') },
            { id: 5, text: getTerm('may') },
            { id: 6, text: getTerm('jun') },
            { id: 7, text: getTerm('jul') },
            { id: 8, text: getTerm('aug') },
            { id: 9, text: getTerm('sep') },
            { id: 10, text: getTerm('oct') },
            { id: 11, text: getTerm('nov') },
            { id: 12, text: getTerm('dec') },
        ]
        freq = [
            { id: "HOURLY", text: getTerm('hourly') },
            { id: "DAILY", text: getTerm('daily') },
            { id: "WEEKLY", text: getTerm('weekly') },
            { id: "MONTHLY", text: getTerm('monthly') },
            { id: "YEARLY", text: getTerm('yearly') },
        ]
        if (count < 1) {
            console.log('loopDone')
            clearInterval(langLoop)

        } else {
            count--
        }
    })
})