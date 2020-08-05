import React, { useState } from "react";
import SearchBar from "../../../components/SearchBar";
import SearchPresenter from "./SearchPresenter"

export default ({ navigation }) => {
  const [term, setTerm] = useState(""); 
  const [shouldFetch, setShouldFetch] = useState(false);
  const onChange = (text) => {
    setTerm(text);
    setShouldFetch(false);
  };
  const onSubmit = () => {
    console.log("Submit");
    setShouldFetch(true);
  };
  navigation.setOptions({
    heaerBackTitle: null,
    headerTitle: () => (
      <SearchBar 
      value={term}
      onChange={onChange}
      onSubmit={onSubmit}
    />
    )
  });
    return (
      <SearchPresenter term={term} shouldFetch={shouldFetch} />
     )
  }