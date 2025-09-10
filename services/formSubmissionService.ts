// IMPORTANT: To enable form submissions, you must set up your own Google Apps Script backend.
// This script will receive form data from the app and save it to a Google Sheet.
//
// Follow these steps:
// 1. Create a new Google Sheet to store responses.
// 2. Go to Extensions > Apps Script in the Google Sheet.
// 3. Replace the default code with the provided `Code.gs` script from this project's documentation.
// 4. Click 'Deploy' > 'New deployment'.
// 5. For 'Execute as', select 'Me'. For 'Who has access', select 'Anyone'.
// 6. Click 'Deploy'. You will need to authorize the script's permissions.
// 7. Copy the generated 'Web app' URL.
// 8. Paste the URL below to replace the empty string.

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqwgllT5UqBonhDAKiqUGF6UlLm1ZGDR1EAzvV5mx0qid2y-eQ6wR3sTX-LpW3xDAO/exec'; // <-- PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE

interface FilePayload {
  key: string; // e.g., 'receipt', 'file1'
  filename: string;
  mimeType: string;
  data: string; // base64 string
}

interface SubmissionPayload {
  formType: string;
  formData: Record<string, any>;
  files: FilePayload[];
}

// Utility to convert a File object to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // result is "data:image/png;base64,iVBORw0KGgo..."
      // we only want the part after the comma
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
};

// Main function to handle the submission
export const submitForm = async (payload: SubmissionPayload): Promise<any> => {
  if (!APPS_SCRIPT_URL) {
    const errorMessage = "Form submission is not configured. Please set the APPS_SCRIPT_URL in services/formSubmissionService.ts";
    console.error(errorMessage);
    // Throw an error to ensure the UI can report the configuration issue.
    throw new Error(errorMessage); 
  }

  // The backend script is designed to parse a 'fullName' field.
  // We will construct it from the separate 'firstName' and 'lastName' fields provided by the forms
  // to ensure compatibility with the existing backend logic.
  const formDataWithFullName = { ...payload.formData };
  if (formDataWithFullName.firstName && formDataWithFullName.lastName) {
    formDataWithFullName.fullName = `${formDataWithFullName.firstName} ${formDataWithFullName.lastName}`.trim();
  }

  // The backend script expects a top-level `formType` of 'create' or 'update' for routing.
  // The specific type of form (e.g., "Warranty Registration") is passed inside the formData
  // object, which the backend then uses for the "Ticket Category" column.
  const submissionPacket = {
    formType: 'create', // Hardcode to 'create' for all new submissions.
    formData: {
      ...formDataWithFullName, // Use the formData that now includes 'fullName'
      formType: payload.formType, // Move the specific form type (e.g., "Product Support") here.
      Timestamp: new Date().toLocaleString(),
    },
    files: payload.files,
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps Script web apps expect text/plain for postData
      },
      body: JSON.stringify(submissionPacket),
    });

    const result = await response.json();

    if (result.status !== 'success') {
      throw new Error(result.message || 'An unknown error occurred during submission.');
    }

    return result;

  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};

export const processFiles = async (files: File[], keyPrefix: string): Promise<FilePayload[]> => {
  const filePromises: Promise<FilePayload>[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file) {
      const promise = fileToBase64(file).then(base64Data => ({
        key: `${keyPrefix}${i + 1}`,
        filename: file.name,
        mimeType: file.type,
        data: base64Data
      }));
      filePromises.push(promise);
    }
  }
  return Promise.all(filePromises);
};

export const processSingleFile = async (file: File, key: string): Promise<FilePayload[]> => {
  if (!file) return [];
  const base64Data = await fileToBase64(file);
  return [{
    key,
    filename: file.name,
    mimeType: file.type,
    data: base64Data
  }];
};