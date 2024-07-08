import { HocuspocusProvider } from '@hocuspocus/provider';
import { type SuikaEditor } from '@suika/core';

// import { WebsocketProvider } from 'y-websocket';
// import * as Y from 'yjs';
import { SuikaBinding } from './y-suika';

export const joinRoom = (editor: SuikaEditor) => {
  // const yDoc = new Y.Doc();
  // const yMap = yDoc.getMap<Record<string, any>>('suika-3456');
  // new WebsocketProvider('ws://localhost:8912', 'suika-demo-room', yDoc);
  const provider = new HocuspocusProvider({
    url: 'ws://localhost:5678',
    name: 'suika-demo-room',
  });

  const yMap = provider.document.getMap<Record<string, any>>('suika-3456');

  new SuikaBinding(yMap, editor);
};
