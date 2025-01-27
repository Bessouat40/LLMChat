import { Settings } from '../settings';

export class ApiService {
  static newMessageUrl: string = Settings.API_URL;

  static async postQuestion(question: string): Promise<string> {
    try {
      const response = await fetch(this.newMessageUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error while processing question:', error);
      throw new Error(`Error during API call: ${error}`);
    }
  }
}
