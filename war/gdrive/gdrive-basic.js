var CLIENT_ID = '670051787721.apps.googleusercontent.com';
//var CLIENT_ID = '670051787721-99o5rnulaegrb48n09vtknirp5t3627m.apps.googleusercontent.com';
//var API_KEY = 'AIzaSyBDgJ6v23e2RrU_Ffzx9HtJlSkeF6QyxZc';
var SCOPES = 'https://www.googleapis.com/auth/drive';

/**
 *	Called when the client library is loaded to start the auth flow
 */
function handleClientLoad() {
	console.log('handleClientLoad');
	//gapi.client.setApiKey(API_KEY);
	window.setTimeout(checkAuth, 1);
}

/**
 * Check if the current user has authorized the application
 */
function checkAuth() {
	console.log('checkAuth');
	gapi.auth.authorize(
			{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
			handleAuthResult);
}

/**
 * Called when authorization server replies.
 * 
 * @param {Object} authResult Authorization result
 */
function handleAuthResult(authResult) {
	console.log('handleAuthResult');
	var filePicker = document.getElementById('filePicker');
	var authButton = document.getElementById('authButton');
	if (authResult && !authResult.error) {
		console.log('handleAuthResult OK');
		// Access token has been successfully retrieved, requests can be sent to the API		
		authButton.style.display = 'none';
		filePicker.style.display = 'block';
		filePicker.onchange = uploadFile;
	} else {
		console.log('handleAuthResult null or error');
		filePicker.style.display = 'none';
		authButton.style.display = 'block';
		authButton.value = 'Click to authenticate';
		// No access token could be retrieved, force the authorization flow
		authButton.onclick = function () {
			gapi.auth.authorize(
				{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
				handleAuthResult);
		}
		
	}
}

/**
 * Start the file upload
 * @param evt
 */
function uploadFile(evt) {
	console.log('uploadFile');
	gapi.client.load('drive', 'v2', function() {
		var file = evt.target.files[0];
		insertFile(file);
	});
}

/**
 * Insert new file
 * 
 * @param {File} fileData File object to read data from
 * @param {Function} callback Function to call when the request is complete
 */
function insertFile(fileData, callback) {
	console.log('insertFile');
	const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = function(e) {
      var contentType = fileData.type || 'application/octet-stream';
      var metadata = {
        'title': fileData.name,
        'mimeType': contentType
      };

      var base64Data = btoa(reader.result);
      var multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: ' + contentType + '\r\n' +
          'Content-Transfer-Encoding: base64\r\n' +
          '\r\n' +
          base64Data +
          close_delim;

      var request = gapi.client.request({
          'path': '/upload/drive/v2/files',
          'method': 'POST',
          'params': {'uploadType': 'multipart'},
          'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
          },
          'body': multipartRequestBody});
      if (!callback) {
        callback = function(file) {
          console.log("kind=" + file.kind + ' id=' + file.id);
          copyFile(file.id);
        };
      }
      request.execute(callback);
    }
}

function copyFile(fileId, callback) {
	console.log('copyFile');
	var body = {'title': 'Kopia'};
    var request = gapi.client.drive.files.copy({
        'fileId': fileId,
        'resource': body
    });
    
    if (!callback) {
        callback = function(file) {
          console.log("COPIED kind=" + file.kind + ' id=' + file.id);
        };
      }
    request.execute(callback);
}