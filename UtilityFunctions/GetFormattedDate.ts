export const getFormattedDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0"); // Ensures two digits
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};
