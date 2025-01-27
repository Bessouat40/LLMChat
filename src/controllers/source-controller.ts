import { SourceModel, Source } from '../models/chat-model';
import { SourceView } from '../views/source-view';
import { SourceService } from '../services/source-service';

export class SourceController {
  private model: SourceModel;
  private view: SourceView;

  constructor(model: SourceModel, view: SourceView) {
    this.model = model;
    this.view = view;

    this.view.onAddSource((sourceType: string, sourcePath: string) => {
      this.addNewSource(sourceType, sourcePath);
    });

    this.loadSources();
  }

  private async loadSources() {
    try {
      const sources = await SourceService.getSources();
      this.model.setSources(sources);
      this.view.setSources(this.model.getSources());
    } catch (err) {
      console.error('Failed to load sources:', err);
    }
  }

  async addNewSource(sourceType: string, sourcePath: string) {
    this.view.setIngestionInProgress(true);

    const newSource = new Source(sourceType, sourcePath);
    try {
      const msg = await SourceService.addSource(newSource);
      console.log('addNewSource response:', msg);

      await this.loadSources();

      this.view.setIngestionInProgress(false);

      this.view.showIngestionSuccessMessage('Ingestion completed!');
    } catch (err) {
      console.error('Failed to add new source:', err);
      this.view.setIngestionInProgress(false);
      this.view.showIngestionErrorMessage('Error during ingestion');
    }
  }
}
