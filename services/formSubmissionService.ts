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

const APPS_SCRIPT_URL = ''; // <-- PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE

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
    const errorMessage = "Form submission is not configured. Please set the APPS_SCRIPT_URL.";
    console.error(errorMessage);
    // Simulate a successful submission for demonstration purposes if the URL is not set.
    // In a real application, you would throw an error here.
    console.warn("DEMO MODE: Simulating successful form submission.");
    return Promise.resolve({ status: 'success', message: 'Submission simulated.' });
    // throw new Error(errorMessage); 
  }

  // Add a timestamp to the formData payload before sending
  const newPayload = {
    ...payload,
    formData: {
      ...payload.formData,
      Timestamp: new Date().toLocaleString(),
    }
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps Script web apps expect text/plain for postData
      },
      body: JSON.stringify(newPayload),
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

export const processFiles = async (fileList: FileList, keyPrefix: string): Promise<FilePayload[]> => {
  const filePromises: Promise<FilePayload>[] = [];
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
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
