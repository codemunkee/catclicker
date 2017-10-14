
/* jshint esversion: 6 */
(function() {
  console.log('hi');
  var myHeaders = new Headers();

  fetch('http://thecatapi.com/api/images/get?format=xml&results_per_page=20')
    .then(response => {
      let reader = response.body.getReader();
      let bytesReceived = 0;

      reader.read().then(function processResult(result) {
        if (result.done) {
          console.log("Fetch complete");
          console.log(result);
          return;
        }

        bytesReceived += result.value.length;
        console.log('Received', bytesReceived, 'bytes of data so far.');

        return reader.read().then(processResult);
      });
    })
    .then(console.log('foo'));
})();
