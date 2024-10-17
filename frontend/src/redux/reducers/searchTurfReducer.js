import { SEARCH_TURF } from "../actions/userActions";

const initialState = {
    location : '',
    distance : '',
    maxGroupSize : ''
}

const searchTurfReducer = (state = initialState, action) => {
    switch(action.type){
        case SEARCH_TURF:
            return {
                ...state,
                location : action.payload.location,
                distance : action.payload.distance,
                maxGroupSize : action.payload.maxGroupSize
            }
        default:
            return state;
    }
};

export default searchTurfReducer;
