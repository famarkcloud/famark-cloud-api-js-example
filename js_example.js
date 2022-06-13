var _sessionId = null;
var frmLogin = document.getElementById("frmLogin");
frmLogin.addEventListener('submit', frmLoginSubmit);

function frmLoginSubmit(e) {
    e = e || window.event;
    e.preventDefault();

    var spnMessage = document.body.querySelector('.spnMessage');
    if (spnMessage)
        spnMessage.parentNode.removeChild(spnMessage);

    var nameInputs = [{ "name": "dn", "label": "domain name" }, { "name": "un", "label": "user name" }];

    for (var i = 0; i < nameInputs.length; i++) {
        var item = nameInputs[i];
        var nameInput = frmLogin.elements[item.name];
        var frmMessage = validateAlphaNumeric(nameInput, item.label);

        if (frmMessage) {
            appendMessageSpan(frmMessage, frmLogin);
            return;
        }
    }

    var request = {};
    request.DomainName = frmLogin.elements['dn'].value;
    request.UserName = frmLogin.elements['un'].value;
    request.Password = frmLogin.elements['pwd'].value;

    apiPostData('/Credential/Connect', request, null, function (response, errorMessage) {
        if (errorMessage) {
            appendMessageSpan(errorMessage, frmLogin);
            frmLogin.className = 'error';
        } else {
            _sessionId = response;
            var headerSessionId = document.getElementById('headerSessionId');
            headerSessionId.innerHTML = "SessionId: " + _sessionId;
            document.getElementById('divConnect').style.display = 'none';
            document.getElementById('divRecords').style.display = 'block';
        }
    });
}

function validateAlphaNumeric(frmInput, label) {
    if (frmInput.value == '') {
        frmLogin.className = 'error';
        frmInput.focus();
        return 'Enter the ' + label + '!';
    }
    if (frmInput.value.match(/^[a-zA-Z0-9]+$/) == null) {
        frmLogin.className = 'error';
        frmInput.focus();
        return 'Invalid ' + label + ', it must be alphanumeric.';
    }

    frmLogin.className = '';
    frmLogin.parentNode.className = '';
    return null;
}

function appendMessageSpan(frmMessage, frmAny) {
    var spnMessage = document.createElement('span');
    spnMessage.className = 'spnMessage';
    frmAny.insertBefore(spnMessage, frmAny.firstChild);
    spnMessage.innerHTML = frmMessage;
    return spnMessage;
}

function apiPostData(urlSuffix, request, sessionId, callback) {
    var url = 'https://www.famark.com/Host/api.svc/api' + urlSuffix;

    var strRequest = JSON.stringify(request);

    var http = new XMLHttpRequest();
    http.onload = function () {
        var response = JSON.parse(http.responseText);
        var errorMessage = http.getResponseHeader("ErrorMessage");
        //if response is null then check response header for ErrorMessage
        callback(response, errorMessage);
    };
    http.onerror = function () {
        alert("A network error occurred which could be a CORS issue or a dropped internet connection. Check browser console for more information...");
    };

    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    http.setRequestHeader("Accept", "application/json; charset=UTF-8");
    if (sessionId)
        http.setRequestHeader("SessionId", sessionId);
    http.send(strRequest);
}
/*--For Create Record--*/
var frmCreateProfile = document.getElementById("frmCreateProfile");
frmCreateProfile.addEventListener('submit', frmCreateProfileSubmit);

function frmCreateProfileSubmit(e) {
    e = e || window.event;
    e.preventDefault();

    var spnMessage = document.body.querySelector('.spnMessage');
    if (spnMessage)
        spnMessage.parentNode.removeChild(spnMessage);

    var dispName = frmCreateProfile.elements['DisplayName'];
    if (dispName.value == '') {
        dispName.focus();
        appendMessageSpan('Enter the display name!', frmCreateProfile);
        return;
    }

    var sysName = frmCreateProfile.elements['SystemName'];
    var frmMessage = validateAlphaNumeric(sysName, 'system name');

    if (frmMessage) {
        appendMessageSpan(frmMessage, frmCreateProfile);
        return;
    }

    var request = {};
    request.DisplayName = dispName.value;
    request.SystemName = sysName.value;

    apiPostData('/System_Profile/CreateRecord', request, _sessionId, function (response, errorMessage) {
        if (errorMessage) {
            appendMessageSpan(errorMessage, frmCreateProfile);
            frmCreateProfile.className = 'error';
        } else {
            appendMessageSpan('Created RecordId: ' + response, frmCreateProfile);
            frmCreateProfile.className = '';
        }
    });
}

/*--For Retrieve Multiple Records--*/
var frmRetrieveProfiles = document.getElementById("frmRetrieveProfiles");
frmRetrieveProfiles.addEventListener('submit', frmRetrieveProfilesSubmit);
function frmRetrieveProfilesSubmit(e) {
    e = e || window.event;
    e.preventDefault();

    var spnMessage = document.body.querySelector('.spnMessage');
    if (spnMessage)
        spnMessage.parentNode.removeChild(spnMessage);

    var request = {};
    request.Columns = 'DisplayName, SystemName, System_ProfileId';
    request.OrderBy = 'DisplayName';

    apiPostData('/System_Profile/RetrieveMultipleRecords', request, _sessionId, function (response, errorMessage) {
        if (errorMessage) {
            appendMessageSpan(errorMessage, frmRetrieveProfiles);
            frmRetrieveProfiles.className = 'error';
        } else {
            var tbody = getTableBody();
            frmRetrieveProfiles.className = '';
            for (var i = 0; i < response.length; i++)
                tbody.appendChild(getRow(response[i]));
        }
    });
}

function getTableBody() {
    var tbody = document.getElementById('tbodyProfiles');
    if (tbody) {
        while (tbody.childNodes.length > 0)
            tbody.removeChild(tbody.lastChild);
        return tbody;
    }

    var table = document.createElement('table');
    frmRetrieveProfiles.parentNode.appendChild(table);
    var thead = table.appendChild(document.createElement('thead'));
    var headRow = thead.appendChild(document.createElement('tr'));
    headRow.appendChild(document.createElement('th')).innerHTML = 'Display Name';
    headRow.appendChild(document.createElement('th')).innerHTML = 'System Name';
    tbody = table.appendChild(document.createElement('tbody'));
    tbody.id = 'tbodyProfiles';
    return tbody;
}

function getRow(record) {
    var tr = document.createElement('tr');
    tr.appendChild(document.createElement('td')).innerHTML = record.DisplayName;
    tr.appendChild(document.createElement('td')).innerHTML = record.SystemName;
    tr.id = record.System_ProfileId;
    return tr;
}
