// IMPORTANT: Replace this with the Google Apps Script Web App URL you copied after deployment.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzPBgiwNELD84rPfcj9uV7bskWven-UvFJFgJSR56Tb_2VhUon6BAvcMkhxMraATnrU/exec';

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