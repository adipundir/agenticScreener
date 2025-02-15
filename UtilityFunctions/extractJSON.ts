export default function extractJsonContent(str : string) {
  // Find the first { and last }
  const startIndex = str.indexOf("{");
  const endIndex = str.lastIndexOf("}");

  // Check if both braces were found
  if (startIndex === -1 || endIndex === -1) {
    throw new Error("No valid JSON object found in string");
  }

  // Extract just the content between the braces, including the braces
  const jsonContent = str.slice(startIndex, endIndex + 1);

  try {
    // Verify it's valid JSON
    JSON.parse(jsonContent);
    return jsonContent;
  } catch (e) {
    throw new Error("Extracted content is not valid JSON");
  }
}
