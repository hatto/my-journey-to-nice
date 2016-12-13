import vars             from 'vars';
import moment           from 'moment';
import InstagramActions from '../actions/InstagramActions';
import $                from 'jquery';

var InstagramApi = class {
    constructor() {
      this.api = vars.instagram;
    }

    getPhotos() {
      var url = this.api.url + "users/self/media/recent";
      $.ajax({
        url: url,
        type: "GET",
        crossDomain: true,
        dataType: "jsonp",
        data: {
          access_token: this.api.accessToken,
          count: 100
        },
        success: function(response){
          InstagramActions.success(response.data);
        }
      });
    }
}

module.exports = new InstagramApi();
