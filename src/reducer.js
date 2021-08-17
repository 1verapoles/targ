import {
    FETCH_POSTS,
    DELETE_POST,
    ADD_POST
} from "./constants";

export default (state = [], action) => {
    switch (action.type) {
        case FETCH_POSTS:
            return action.payload;
            break;
        case DELETE_POST:
            return state.filter(post => { return post.id !== action.payload.id });
            break;
        case ADD_POST:
            return [...state, action.payload];
            break;
        default:
            return state;
    }
};