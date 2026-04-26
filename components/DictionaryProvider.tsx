"use client"

import React, { createContext, useContext } from "react"

const DictionaryContext = createContext<any>(null)

export function DictionaryProvider({ 
  children, 
  dictionary 
}: { 
  children: React.ReactNode
  dictionary: any 
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  )
}

export function useDictionary() {
  const dictionary = useContext(DictionaryContext)
  if (!dictionary) {
    throw new Error("useDictionary must be used within a DictionaryProvider")
  }
  return dictionary
}
