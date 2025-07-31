import { ADD_TO_BAG } from "./actiontype";

const API_BASE_URL = process.env.REACT_APP_BACKEND_API;

export const postAddtoBagRequest = () => {
    return {
      type: ADD_TO_BAG,
    };
};
  


export const postAddtoBag = (payload) => async (dispatch) => {
    dispatch(postBagRequest());
  
    return axios
      .post(`/cart`, payload)
      .then((res) => {
        dispatch(postBagSuccess());
        dispatch(getBagData());
      })
      .catch((err) => {
        dispatch(postBagFailure());
      });
  };