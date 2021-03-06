import { createReducer } from '../utils';
import { LOGIN_USER, SIGNUP_USER } from 'constants/titleBarConstants';

import $ from 'jQuery';

const initialState = {
  activePopover: '',
  anchorEl: ''
};

export default createReducer(initialState, {

  [LOGIN_USER]: (state, payload) => {
    console.log('kenny LOGIN');
    $.ajax({  // TODO: eliminate jQuery!
      url: '/login',
      type: 'POST',
      data: JSON.stringify(payload),
      contentType: 'application/json',
      success: function(data) {
        console.log('success', data);
      },
      error: function(xhr, status, err) {
        console.log('error', err);
      }
    });
    return Object.assign({}, state, {
      username: payload.username
    });
  },

  [SIGNUP_USER]: (state, payload) => {
    // TODO: signup user!
    return Object.assign({}, state, {
      username: payload.username
    });
  }

});
