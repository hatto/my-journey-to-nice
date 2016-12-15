var keyMirror = require('keyMirror');

// Define action constants
module.exports = keyMirror({
  SUBMIT:                   null,
  API_ERROR:                null,
  API_SUCCESS:              null,
  FETCH_PROFILE_SUCCESS:    null,
  FETCH_PROFILE_ERROR:      null,
  GMAP_LOADED:              null,
  FETCHED_ACTIVITY:         null,
  CHANGE_DATES:             null
});
