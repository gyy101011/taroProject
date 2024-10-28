import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import userReducer from './modules/user';

const store = configureStore({
    reducer: {
        user: userReducer
    }
});
//从store 本身推断出RootState'AppDispatch类型
export type RootState = ReturnType<typeof store.getState>
//推断出类型:fposts:Postsstate.comments:commentsstate.users: UsersState]
export type AppDispatch = typeof store.dispatch
//在整个应用程序中使用，而不是简单的useDispatch和useSelector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;