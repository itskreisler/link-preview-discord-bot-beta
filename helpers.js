let removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
let normalizeText = (str) =>{
    return str.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
}
let film102 = {
  professor: "Mrs Duguid",
  numberOfStudents: 8,
  level: "challenging",
};

exports.removeAccents = removeAccents;
exports.normalizeText = normalizeText;