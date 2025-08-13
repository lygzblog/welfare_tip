// src/stores/tabStore.js
import { defineStore } from 'pinia';

export const useTabStore = defineStore('tab', {
    state: () => ({
        selectedTab: '美团', // 默认选中的 Tab
    }),
    actions: {
        setSelectedTab(tab) {
            this.selectedTab = tab;
        },
    },
});