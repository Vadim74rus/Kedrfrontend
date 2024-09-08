import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { api } from './services/api';
import { miningApi } from './services/miningApi'; // Импортируем miningApi
import { balanceApi } from './services/balanceApi'; // Импортируем balanceApi
import auth from '../features/user/userSlice';
import { listenerMiddleware } from '../middleware/auth';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [miningApi.reducerPath]: miningApi.reducer, // Добавляем reducer для miningApi
    [balanceApi.reducerPath]: balanceApi.reducer, // Добавляем reducer для balanceApi
    auth,
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
          .concat(api.middleware)
          .concat(miningApi.middleware) // Добавляем middleware для miningApi
          .concat(balanceApi.middleware) // Добавляем middleware для balanceApi
          .prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;


