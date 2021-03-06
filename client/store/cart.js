import axios from 'axios';

// types
export const CREATE_CART = 'CREATE_CART';
export const ADD_TO_CART = 'ADD_TO_CART';
export const UPDATE_ITEM_IN_CART = 'UPDATE_ITEM_IN_CART';
export const DELETE_FROM_CART = 'DELETE_FROM_CART';
export const RESET_CART = 'RESET_CART';


// action creators
export function createCart(newCart) {
  const action = {
    type: CREATE_CART,
    newCart
  }
  return action;
}

export function addToCart(order) {
  const action = {
    type: ADD_TO_CART,
    order
  };
  return action;
}

export function updateItemInCart(item) {
  const action = {
    type: UPDATE_ITEM_IN_CART,
    item
  }
  return action;
}

export function deleteFromCart(productId) {
  const action = {
    type: DELETE_FROM_CART,
    productId
  }
  return action;
}

export function resetCart(){
  const action = {
    type: RESET_CART
  };
  return action;
}


// thunk creators

export const fetchCart = () => dispatch => {
  return axios
  .get('/api/active-orders')
  .then(res => res.data)
  .then(cartFromDb => {

    const newCart = cartFromDb.reduce((newCartObj, item) => {
      const { productId, quantity } = item;
      newCartObj[productId] = { productId, quantity };
      return newCartObj;
    }, {});
    dispatch(createCart(newCart));
  })
  .catch(err => console.log(err));
}

export const postToCart = id => dispatch => {
  return axios
    .post('/api/active-orders', { productId: id })
    .then(res => res.data)
    .then(({ productId, quantity }) => {
      const order = {[productId]: { productId, quantity }};
      dispatch(addToCart(order));
    })
    .catch(err => console.log(err));
};


export const deleteProductFromCart = productId => dispatch => {
  return axios
    .delete(`/api/active-orders/${productId}`)
    .then(() => dispatch(deleteFromCart(productId)))
    .catch(err => console.log(err));
};

export const updateProductQuantity = (productId, newQuantity) => dispatch => {
  return axios
    .put(`/api/active-orders/${productId}`, { newQuantity })
    .then(res => res.data)
    .then(updatedItem => {
      const updatedItemObj = {[updatedItem.productId]: updatedItem };
      if (!updatedItem.quantity) {
        dispatch(deleteProductFromCart(updatedItem.productId));
      } else {
        dispatch(updateItemInCart(updatedItemObj));
      }
    })
    .catch(err => console.log(err));
}

export const deleteAssociatedProductsFromActiveOrder = idsArray => dispatch => {
  return axios.all(idsArray.map(id => dispatch(deleteProductFromCart(id))))
    .then(() => {})
    .catch(() => console.error('Could not remove items from active orders table and/or cart.'));
    // add 'purchasedItems' slice of state
};


// reducer
export default function cart(state = {}, action) {
  let productId;
  switch (action.type) {
    case CREATE_CART:
      return action.newCart;
    case ADD_TO_CART:
      return Object.assign({}, state, action.order);
    case UPDATE_ITEM_IN_CART:
      productId = Object.keys(action.item)[0];
      return Object.assign({}, state, {
        [productId]: {
          productId,
          quantity: action.item[productId].quantity
        }
      });
    case DELETE_FROM_CART:
      return Object.keys(state).reduce((newCart, itemId) => {
        if (+itemId !== +action.productId) {
          newCart[itemId] = state[itemId];
        }
        return newCart;
      }, {});
    case RESET_CART:
      return {};
    default:
      return state;
  }
}
