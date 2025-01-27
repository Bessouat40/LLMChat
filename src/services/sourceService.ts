import { Settings } from '../settings';
import { Source } from '../models/chat-model';

export class SourceService {
  static async getSources(): Promise<Source[]> {
    try {
      const response = await fetch(`${Settings.BASE_URL}/listSources`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const sources: Source[] = data.map((item: any) => {
        return new Source(item.sourceType, item.sourcePath);
      });
      return sources;
    } catch (error: any) {
      console.error('Error while fetching sources:', error);
      throw error;
    }
  }

  static async addSource(source: Source): Promise<string> {
    try {
      const response = await fetch(Settings.SOURCE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceType: source.sourceType,
          sourcePath: source.sourcePath,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.message ?? data.error;
    } catch (error: any) {
      console.error('Error while adding source:', error);
      throw new Error(`Error during source addition: ${error}`);
    }
  }
}
