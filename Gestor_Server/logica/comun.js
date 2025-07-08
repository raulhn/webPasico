function formatDateToMySQL(date) {
  try {
    if (!date) {
      return null;
    }
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    return null;
  }
}

module.exports.formatDateToMySQL = formatDateToMySQL;
