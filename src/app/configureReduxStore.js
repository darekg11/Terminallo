import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { enableBatching } from 'redux-batched-actions';
import rootReducer from './reducers/reducersCombine';

export default function configureStore(initialState) {
  return createStore(enableBatching(rootReducer), initialState, applyMiddleware(thunk));
}
