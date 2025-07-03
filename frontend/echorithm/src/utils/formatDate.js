export const formatDate = (dateStr) => {
  try {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Invalid date format:", dateStr);
    return "";
  }
};
