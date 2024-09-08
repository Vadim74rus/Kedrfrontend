import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { BASE_URL } from '../../constants';

const baseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token || localStorage.getItem('token');

        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 });

export const balanceApi = createApi({
    reducerPath: 'balanceApi',
    baseQuery: baseQueryWithRetry,
    refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getUserBalance: builder.query<{ amount: number }, { userId: string }>({
            query: (params) => ({
                url: `/balance/${params.userId}`,
                method: 'GET',
            }),
        }),
        updateUserBalance: builder.mutation<void, { userId: string; amount: number }>({
            query: (body) => ({
                url: `/balance/${body.userId}`,
                method: 'PUT',
                body,
            }),
        }),
    }),
});

export const {
    useGetUserBalanceQuery,
    useUpdateUserBalanceMutation,
} = balanceApi;
