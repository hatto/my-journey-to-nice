import vars             from 'vars';
import axios            from 'axios';
import moment           from 'moment';
import ResultsActions   from '../actions/ResultsActions';
import ProfileActions   from '../actions/ProfileActions';

var StravaApi = class {
    constructor() {
      this.api = vars.strava;
    }

    callApi(page: 1) {
      return axios.get(this.api.url+'athlete/activities', {
        params: {
          access_token: this.api.accessToken,
          after: moment("2017-12-31").unix(),
          per_page: 200,
          page: page
        }
      })
    }

    getData() {
      let datas = [];
      let firstData = this.callApi(1);
      let secondData = this.callApi(2);
      let thirdData = this.callApi(3);

      Promise.all([firstData, secondData, thirdData])
        .then(response => {
          // merge arrays
          response.map( (item, index) => {
            datas = datas.concat(item.data);
          });
          ResultsActions.success(datas);
        })
        .catch(response => {
          console.log('error');
          console.log(response);
          // ResultsActions.receivedAPIError({
          //   response: 'some error message'
          // });
        })
        ;

    }

    getActivity(id) {
      axios.get(this.api.url+'activities/' + id, {
        params: {
          access_token: this.api.accessToken
        }
      })
      .then(function (response) {
          // console.log(response);
          ResultsActions.successActivity(response.data);
      })
      .catch(function (response) {
        console.log('error');
        console.log(response);
        // ResultsActions.receivedAPIError({
        //   response: 'some error message'
        // });
      })
      ;
    }

    getProfile() {
      axios.get(this.api.url+'athlete', {
        params: {
          access_token: this.api.accessToken
        }
      })
      .then(function (response) {
          ProfileActions.success(response.data);
      })
      .catch(function (response) {
        console.log('profile fetch error');
        console.log(response);
        // ResultsActions.receivedAPIError({
        //   response: 'some error message'
        // });
      })
      ;
    }
}

module.exports = new StravaApi();
