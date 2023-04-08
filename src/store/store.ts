import { configureStore } from '@reduxjs/toolkit'
import metaSlice from './metaSlice'
export const store = configureStore({
  reducer: {
    meta: metaSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch