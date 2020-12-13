export const experienceDict = {
  0: "Chưa có kinh nghiệm",
  1: "Dưới 1 năm",
  2: "1 năm",
  3: "2 năm",
  4: "3 năm",
  5: "4 năm",
  6: "5 năm",
  7: "Trên 5 năm",
  99: "Không yêu cầu",
};

export const getSearchData = (searchData) => {
  let result = {};
  for (const key in searchData) {
    if (typeof searchData[key] === "object") {
      if (searchData[key].length !== 0) {
        result[key] = searchData[key];
      }
    } else {
      if (searchData[key] !== "") {
        result[key] = searchData[key];
      }
    }
  }

  return result;
};

export const normalizeLongName = (text) => {
  let result = text.split(" ");
  if (result.length > 7) {
    result = result.slice(0, 7).join(" ") + "...";
  } else {
    result = text;
  }
  return result;
};

export const normalizeWorkPlaces = (workplaces) => {
  const workplaces2 = workplaces.map(a => a.name);
  let workplace =
    workplaces2.length > 3
      ? workplaces2.slice(0, 3).join(", ") + ", ..."
      : workplaces2.join(", ");
  return workplace;
};
