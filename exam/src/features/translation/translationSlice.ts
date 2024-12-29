import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface TranslationHistoryItem {
    id: string;
    from: string;
    to: string;
    originalText: string;
    translatedText: string;
    timestamp: number;
}

interface TranslationState {
    fromLanguage: string;
    toLanguage: string;
    query: string;
    result: string;
    loading: boolean;
    error: string | null;
    history: TranslationHistoryItem[];
}

const initialState: TranslationState = {
    fromLanguage: 'Autodetect',
    toLanguage: 'ru-RU',
    query: '',
    result: '',
    loading: false,
    error: null,
    history: [],
};

export const fetchTranslation = createAsyncThunk<
    string,
    { query: string; from: string; to: string },
    { rejectValue: string }
>(
    'translation/fetchTranslation',
    async ({ query, from, to }, { rejectWithValue }) => {
        try {
            const apiURL = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=${from}|${to}`;

            const response = await fetch(apiURL);
            const data = await response.json();

            if (data.responseData?.translatedText) {
                return data.responseData.translatedText;
            } else {
                return rejectWithValue('Не удалось получить перевод из API');
            }
        } catch (error) {
            return rejectWithValue('Ошибка запроса');
        }
    }
);

const translationSlice = createSlice({
    name: 'translation',
    initialState,
    reducers: {
        setFromLanguage(state, action: PayloadAction<string>) {
            state.fromLanguage = action.payload;
        },
        setToLanguage(state, action: PayloadAction<string>) {
            state.toLanguage = action.payload;
        },
        setQuery(state, action: PayloadAction<string>) {
            state.query = action.payload;
        },
        clearHistory(state) {
            state.history = [];
            localStorage.removeItem('translation_history');
        },
        loadHistoryFromLocalStorage(state) {
            const saved = localStorage.getItem('translation_history');
            if (saved) {
                state.history = JSON.parse(saved);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTranslation.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.result = '';
            })
            .addCase(fetchTranslation.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;

                const newItem: TranslationHistoryItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    from: state.fromLanguage,
                    to: state.toLanguage,
                    originalText: state.query,
                    translatedText: action.payload,
                    timestamp: Date.now(),
                };
                state.history.push(newItem);

                localStorage.setItem('translation_history', JSON.stringify(state.history));
            })
            .addCase(fetchTranslation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : 'Ошибка при переводе';
            });
    },
});

export const {
    setFromLanguage,
    setToLanguage,
    setQuery,
    clearHistory,
    loadHistoryFromLocalStorage,
} = translationSlice.actions;

export default translationSlice.reducer;

export const selectFromLanguage = (state: RootState) => state.translation.fromLanguage;
export const selectToLanguage = (state: RootState) => state.translation.toLanguage;
export const selectQuery = (state: RootState) => state.translation.query;
export const selectResult = (state: RootState) => state.translation.result;
export const selectLoading = (state: RootState) => state.translation.loading;
export const selectError = (state: RootState) => state.translation.error;
export const selectHistory = (state: RootState) => state.translation.history;
