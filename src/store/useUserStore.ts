import {create} from 'zustand';

interface StoreState {
    storeId: string;
    setStoreId: (storeId: string) => void;
}

export const useUserStore = create<StoreState>()(set => ({
    storeId: '',
    setStoreId: (storeId: string) => set({storeId})
}))