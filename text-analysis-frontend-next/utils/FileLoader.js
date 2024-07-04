// TODO makes sense to separate the functions directly... based on the type of feature (and maybe product)
export const fetchFileContent = async (fileName, scoreDetails, setter, highlight = null) => {
    console.log("fetchFileContent | ", {fileName, scoreDetails, setter, highlight});
    try {
      const response = await fetch(`/data/codechecker_files/${fileName}`);
      if (response.ok) {
        const text = await response.text();
        if (highlight) {
          setter(highlight(text, scoreDetails));
        } else {
          setter(text);
        }
      } else {
        setter("Error loading file content. response not ok");
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      setter("Error loading file content");
    }
  };
  