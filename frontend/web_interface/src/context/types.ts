export type Theme = 'light' | 'dark' | 'system';

export interface ThemeProviderState {
    theme: Theme;
    setTheme: (theme: Theme) => void;

}