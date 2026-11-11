export function removeSubstring(str: string) {
    // Verifica se a substring .docx ou .pdf está presente
    if (str.includes(".docx")) {
      str = str.replace(".docx", "");  // Remove ".docx"
    }

    if (str.includes(".pdf")) {
      str = str.replace(".pdf", "");   // Remove ".pdf"
    }
  
    return str;
  }