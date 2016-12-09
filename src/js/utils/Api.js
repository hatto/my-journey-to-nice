import vars         from 'vars';
import axios        from 'axios';
import FormActions  from '../actions/FormActions';

var DataApi = class {
    constructor() {
      this.url = vars.api;
      console.log('new api ' + this.url);
    }

    sendData(data) {
      console.log('sending data to url ');
      console.log(data);
      axios.get(this.url)
        .then(function (response) {
            console.log(response);
            FormActions.success({
              response: response.data.message
            });
        })
        .catch(function (response) {
          console.log(response);
          FormActions.receivedAPIError({
            response: 'some error message'
          });
        })
      ;

    }
}

module.exports = new DataApi();
