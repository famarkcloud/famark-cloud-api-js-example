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

    var firstName = frmCreateProfile.elements['FirstName'];
    if (firstName.value == '') {
        firstName.focus();
        appendMessageSpan('Enter the First Name!', frmCreateProfile);
        return;
    }

    var lastName = frmCreateProfile.elements['LastName'];
    if (lastName.value == '') {
        lastName.focus();
        appendMessageSpan('Enter the Last Name!', frmCreateProfile);
        return;
    }

    var phone = frmCreateProfile.elements['Phone'];
    if (phone.value == '') {
        phone.focus();
        appendMessageSpan('Enter the Phone!', frmCreateProfile);
        return;
    }

    var email = frmCreateProfile.elements['Email'];
    if (email.value == '') {
        email.focus();
        appendMessageSpan('Enter the Email!', frmCreateProfile);
        return;
    }

    var request = {};
    request.FirstName = firstName.value;
    request.LastName = lastName.value;
    request.Phone = phone.value;
    request.Email = email.value;

    apiPostData('/Business_Contact/CreateRecord', request, _sessionId, function (response, errorMessage) {
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
    request.Columns = 'FirstName, LastName, Phone, Email, Business_ContactId';
    request.OrderBy = 'FirstName';

    apiPostData('/Business_Contact/RetrieveMultipleRecords', request, _sessionId, function (response, errorMessage) {
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
    frmRetrieveProfiles.parentNode.insertBefore(table, frmRetrieveProfiles.nextSibling);
    var thead = table.appendChild(document.createElement('thead'));
    var headRow = thead.appendChild(document.createElement('tr'));
    headRow.appendChild(document.createElement('th')).innerHTML = 'ContactId';
    headRow.appendChild(document.createElement('th')).innerHTML = 'FirstName';
    headRow.appendChild(document.createElement('th')).innerHTML = 'LastName';
    headRow.appendChild(document.createElement('th')).innerHTML = 'Phone';
    headRow.appendChild(document.createElement('th')).innerHTML = 'Email';
    headRow.appendChild(document.createElement('th')).innerHTML = 'Update';
    headRow.appendChild(document.createElement('th')).innerHTML = 'Delete';
    tbody = table.appendChild(document.createElement('tbody'));
    tbody.id = 'tbodyProfiles';
    return tbody;
}

function getRow(record) {
    var tr = document.createElement('tr');
    tr.appendChild(document.createElement('td')).innerHTML = record.Business_ContactId;
    tr.appendChild(document.createElement('td')).innerHTML = record.FirstName;
    tr.appendChild(document.createElement('td')).innerHTML = record.LastName;
    tr.appendChild(document.createElement('td')).innerHTML = record.Phone;
    tr.appendChild(document.createElement('td')).innerHTML = record.Email;
    tr.appendChild(document.createElement('td')).innerHTML = "<input type='button' value='update' onclick='frmUpdateFormLoad(\"" + record.Business_ContactId + "\");'>";
    tr.appendChild(document.createElement('td')).innerHTML = "<input type='button' value='delete' onclick='frmDeleteProfileSubmit(\"" + record.Business_ContactId + "\", this);'>";
    tr.id = record.System_ProfileId;
    return tr;
}

var frmUpdateProfile = document.getElementById("frmUpdateProfile");
frmUpdateProfile.addEventListener('submit', frmUpdateProfileSubmit);

/*--For Update Record--*/
function frmUpdateFormLoad(contactId) {
    document.getElementById("BussinessContactId").value = contactId;
    document.getElementById("headUpdateProfile").style.display = 'block';
    frmUpdateProfile.style.display = 'block';
    frmUpdateProfile.focus();

    var request = {};
    request.Columns = 'FirstName, LastName, Phone, Email, Business_ContactId';
    request.Business_ContactId = contactId;

    apiPostData('/Business_Contact/RetrieveRecord', request, _sessionId, function (response, errorMessage) {
        if (errorMessage) {
            appendMessageSpan(errorMessage, frmUpdateProfile);
            frmUpdateProfile.className = 'error';
        } else {
            frmUpdateProfile.className = '';
            document.getElementById("FirstName").value = response.FirstName;
            document.getElementById("LastName").value = response.LastName;
            document.getElementById("Phone").value = response.Phone;
            document.getElementById("Email").value = response.Email;
        }
    });
}


function frmUpdateProfileSubmit(e) {
    e = e || window.event;
    e.preventDefault();

    var spnMessage = document.body.querySelector('.spnMessage');
    if (spnMessage)
        spnMessage.parentNode.removeChild(spnMessage);

    var businessContactId = document.getElementById("BussinessContactId");
    if (businessContactId.value == '') {
        businessContactId.focus();
        appendMessageSpan('Enter the Bussiness Contact Id!', frmUpdateProfile);
        return;
    }

    var firstName = frmUpdateProfile.elements['FirstName'];
    if (firstName.value == '') {
        firstName.focus();
        appendMessageSpan('Enter the First name!', frmUpdateProfile);
        return;
    }

    var lastName = frmUpdateProfile.elements['LastName'];
    if (lastName.value == '') {
        lastName.focus();
        appendMessageSpan('Enter the Last name!', frmUpdateProfile);
        return;
    }

    var phone = frmUpdateProfile.elements['Phone'];
    if (phone.value == '') {
        phone.focus();
        appendMessageSpan('Enter the phone!', frmUpdateProfile);
        return;
    }

    var email = frmUpdateProfile.elements['Email'];
    if (email.value == '') {
        email.focus();
        appendMessageSpan('Enter the Email!', frmUpdateProfile);
        return;
    }

    var request = {};
    request.Business_ContactId = businessContactId.value;
    request.FirstName = firstName.value;
    request.LastName = lastName.value;
    request.Phone = phone.value;
    request.Email = email.value;

    console.log("request", request)

    apiPostData('/Business_Contact/UpdateRecord', request, _sessionId, function (response, errorMessage) {
        if (errorMessage) {
            appendMessageSpan(errorMessage, frmUpdateProfile);
            frmUpdateProfile.className = 'error';
        } else {
            appendMessageSpan(' Record Updated ', frmUpdateProfile);
            frmUpdateProfile.className = '';
        }
    });
}

/*--For Delete Records--*/
function frmDeleteProfileSubmit(contactId, btn) {
    var request = {};
    request.Business_ContactId = contactId;
    apiPostData('/Business_Contact/DeleteRecord', request, _sessionId, function (response, errorMessage) {
        if (errorMessage) {
            window.alert(errorMessage);
        } else {
            btn.parentNode.parentNode.style.textDecoration = 'line-through';
        }
    });
}
