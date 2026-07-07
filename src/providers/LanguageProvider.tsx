"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  translations,
  Language
} from "@/lib/translations";


interface LanguageContextType {

  language: Language;

  changeLanguage: (language: Language) => void;

 t: typeof translations[Language];
}


const LanguageContext =
createContext<LanguageContextType | null>(null);



export function LanguageProvider({
  children
}: {
  children: React.ReactNode;
}) {


  const [language, setLanguage] =
    useState<Language>("fr");



  useEffect(() => {

    const savedLanguage =
      localStorage.getItem("language") as Language;


    if (
      savedLanguage === "fr" ||
      savedLanguage === "mg"
    ) {

      setLanguage(savedLanguage);

    }


  }, []);




  function changeLanguage(
    lang: Language
  ) {

    setLanguage(lang);

    localStorage.setItem(
      "language",
      lang
    );

  }




  return (

    <LanguageContext.Provider

      value={{
        language,
        changeLanguage,
        t: translations[language]
      }}

    >

      {children}

    </LanguageContext.Provider>

  );

}




export function useLanguage() {

  const context =
    useContext(LanguageContext);


  if (!context) {

    throw new Error(
      "useLanguage doit être utilisé dans LanguageProvider"
    );

  }


  return context;

}