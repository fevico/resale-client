import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

export type Product = {
    id: any;
    name: string;
    thumbnail?: string;
    category: string;
    price: number;
    images?: string[];
    description: string;
    date: string;
    seller: {
        id: string;
        name: string;
        avatar: string | undefined;
    };
}

const initialState: Product[] = []

const slice = createSlice({
    name: "listings",
    initialState,
    reducers: {
        updateListings: (_, {payload}: PayloadAction<Product[]>) => {
            return payload;
        },

        deleteItem: (oldListings, {payload}: PayloadAction<string>) => {
            return oldListings.filter((item) => item.id !== payload);
        }
    }
})

export const {updateListings, deleteItem} = slice.actions
export const getListings = createSelector(
    (state: RootState) => state, 
    (state) => state.listings
)

export default slice.reducer