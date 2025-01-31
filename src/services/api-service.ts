import { Settings } from '../settings';

export class ApiService {
  static newMessageUrl: string = Settings.API_URL;

  static async postQuestion(
    question: string,
    timeout = 600000
  ): Promise<string> {
    // Create an AbortController to handle the timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout); // Set timeout (e.g., 60 seconds)

    try {
      const response = await fetch(this.newMessageUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
        signal: controller.signal, // Attach the AbortController signal to the fetch request
      });

      // Clear the timeout if the request completes successfully
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      // Clear the timeout in case of an error
      clearTimeout(timeoutId);

      // Handle the error
      throw new Error(`Error during API call: ${error}`);
    }
  }
}
