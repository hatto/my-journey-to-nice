import vars             from 'vars';
import axios            from 'axios';
import moment           from 'moment';
import InstagramActions from '../actions/InstagramActions';

var InstagramApi = class {
    constructor() {
      this.api = vars.instagram;
    }

    getPhotos() {
      axios.get(this.api.url+'users/self/media/recent/', {
        params: {
          access_token: this.api.accessToken
        }
      })
      .then(function (response) {
          console.log(response);
        //   InstagramActions.success(response.data);
      })
      .catch(function (response) {
        console.log('instagram api error');
        console.log(response);
        // ResultsActions.receivedAPIError({
        //   response: 'some error message'
        // });
      })
      ;
    }

}

module.exports = new InstagramApi();
