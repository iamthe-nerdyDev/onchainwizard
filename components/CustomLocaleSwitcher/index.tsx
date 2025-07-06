import React from "react";
import { LocaleSwitcher } from "lingo.dev/react-client";

const CustomLocaleSwitcher = () => {
  return (
    <LocaleSwitcher
      className="border border-gray-200 pl-2.5 pr-8 py-1 rounded-md font-medium font-mono"
      locales={["en", "es", "fr", "de"]}
    />
  );
};

export default CustomLocaleSwitcher;
