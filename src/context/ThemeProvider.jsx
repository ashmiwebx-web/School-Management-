import React, { createContext, useContext } from "react";
import { defaultTheme } from "../constants/theme";

const ThemeContext = createContext(defaultTheme);

export default function ThemeProvider({ children }) {
  const { colors, borderRadius, fontFamily } = defaultTheme;

  return (
    <ThemeContext.Provider value={defaultTheme}>
      <style>
        {`:root {
          --color-primary: ${colors.primary};
          --color-primaryHover: ${colors.primaryHover};
          --color-text: ${colors.text};
          --color-textBody: ${colors.text};
          --color-textMuted: #6b7280;
          --color-border: ${colors.border};
          --color-borderSoft: ${colors.border};
          --color-background: ${colors.background};
          --color-surface: #ffffff;
          --color-surfaceSoft: ${colors.background};
          --color-tableHead: #f5f7fb;
          --color-blue: ${colors.primary};
          --color-blueSoft: #eef2ff;
          --radius: ${borderRadius};
          --font-family: ${fontFamily};
        }`}
      </style>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
