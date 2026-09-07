// CloudFront Function (viewer-request): directory index rewrite.
// Maps requests like /admin or /admin/ to /admin/index.html so S3 static
// subfolders resolve correctly. Leaves files with extensions untouched.
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (!uri.includes('.')) {
    request.uri = uri + '/index.html';
  }

  return request;
}
