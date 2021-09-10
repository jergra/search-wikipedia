export const getSearchTerm = () => {
    const rawSearchTerm = document.getElementById("search").value.trim();
    const regex = /[ ]{2,}/gi;
    const searchTerm = rawSearchTerm.replaceAll(regex, " ");
    return searchTerm;
  };
  
  export const retrieveSearchResults = async (searchTerm) => {
    const wikiSearchString = getWikiSearchString(searchTerm);
    const wikiSearchResults = await requestData(wikiSearchString);
    let resultArray = [];
    if (wikiSearchResults.hasOwnProperty("query")) {
      resultArray = processWikiResults(wikiSearchResults.query.pages);
    }
    console.log("within this json we drill down to wikiSearchResults.query.pages and then organize this key:value info in a useful way and put it in an array:", resultArray)
    return resultArray;
  };
  
  const getWikiSearchString = (searchTerm) => {
    const maxChars = getMaxChars();
    const rawSearchString = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages|extracts&exchars=${maxChars}&exintro&explaintext&exlimit=max&format=json&origin=*`;
    console.log("rawSearchString:", rawSearchString)
    const searchString = encodeURI(rawSearchString);
    console.log("searchString (encodeURI applied to rawSearchString):", searchString)
    return searchString;
  };
  
  const getMaxChars = () => {
    const width = window.innerWidth || document.body.clientWidth;
    let maxChars;
    if (width < 414) maxChars = 65;
    if (width >= 414 && width < 1400) maxChars = 100;
    if (width >= 1400) maxChars = 130;
    return maxChars;
  };
  
  const requestData = async (searchString) => {
    try {
      const response = await fetch(searchString);
      console.log("response:", response)
      const data = await response.json();
      console.log("data: response is now json data:", data)
      return data;
    } catch (err) {
      console.error(err);
    }
  };
  
  const processWikiResults = (results) => {
    const resultArray = [];
    Object.keys(results).forEach((key) => {
      const id = key;
      const title = results[key].title;
      const text = results[key].extract;
      const img = results[key].hasOwnProperty("thumbnail")
        ? results[key].thumbnail.source
        : null;
      const item = {
        id: id,
        title: title,
        img: img,
        text: text
      };
      resultArray.push(item);
    });
    return resultArray;
  };