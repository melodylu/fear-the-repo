import { COUNTER_INCREMENT } from 'constants/counter';

export default {
  increment: () => ({ type : COUNTER_INCREMENT }),
  fetchUser
};

/*
This is our action creator. In HomeView.js line 29, we bound this to dispatch via bindActionCreators(), which means it will automatically dispatch the action when said action occurs.

This action is fired off in HomeView.js line 54 (onClick)
*/


export function fetchUser(userId) {

  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function(dispatch) {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    // dispatch(requestPosts(reddit))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.


    // var body = {};
    // body.id = userId;
    // console.log(body)
    // // var data = new FormData();
    // // data.append( "json", JSON.stringify( payload ) );


    return fetch('http://localhost:3000/api/findauser', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: 1
        })
      })
      .then(response => response.json())
      .then(json =>

        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        // console.log(myInit.body)
        dispatch(receivePosts(userId, json))
      )

    // In a real world app, you also want to
    // catch any error in the network call.
  }
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS'

function receivePosts(userId, json) {
  console.log(json);
  return {
    type: RECEIVE_POSTS,
    userId,
    json,
    receivedAt: Date.now()
  }
}
