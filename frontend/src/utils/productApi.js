import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL, 
  }),

  endpoints: (builder) => ({
    
    getProducts: builder.query({
      query: (params) => {
        const queryString = params
          ? `?${new URLSearchParams(params).toString()}`
          : '';

        return `/product/public/products${queryString}`;
      },

      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return endpointName + JSON.stringify(queryArgs);
      },

      keepUnusedDataFor: 60, // seconds
    }),

  }),
})

export const { useGetProductsQuery } = productApi;