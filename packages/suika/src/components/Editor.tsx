import './Editor.scss';

import { throttle } from '@suika/common';
import { SuikaEditor } from '@suika/core';
import { type FC, useEffect, useRef, useState } from 'react';

import { EditorContext } from '../context';
// import { AutoSaveGraphics } from '../store/auto-save-graphs';
import { joinRoom } from '../store/join-room';
import { type SuikaBinding } from '../store/y-suika';
import { type IUserItem } from '../type';
import { ContextMenu } from './ContextMenu';
import { Header } from './Header';
import { InfoPanel } from './InfoPanel';
import { LayerPanel } from './LayerPanel';
import { MultiCursorsView } from './MultiCursorsView';

const topMargin = 48;
const leftRightMargin = 240 * 2;

const Editor: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [editor, setEditor] = useState<SuikaEditor | null>(null);

  const [viewWidth, setViewWidth] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);

  const [users, setUsers] = useState<IUserItem[]>([]);
  const [awarenessClientId, setAwarenessClientId] = useState(-1);

  useEffect(() => {
    if (containerRef.current) {
      const width = document.body.clientWidth - leftRightMargin;
      const height = document.body.clientHeight - topMargin;
      setViewWidth(width);
      setViewHeight(height);

      const editor = new SuikaEditor({
        containerElement: containerRef.current,
        width,
        height,
        offsetY: 48,
        offsetX: 240,
        showPerfMonitor: false,
      });
      (window as any).editor = editor;

      // new AutoSaveGraphics(editor);
      // path: `/files/1234`
      let fileId = '';
      const pathname = location.pathname;
      const suffix = '/files/';
      if (pathname.startsWith(suffix)) {
        fileId = pathname.slice(suffix.length);
      }

      let suikaBinding: SuikaBinding | null = null;
      if (fileId) {
        suikaBinding = joinRoom(editor, fileId);
        setAwarenessClientId(suikaBinding.awareness.clientID);
        suikaBinding.on('usersChange', setUsers);
      }

      const changeViewport = throttle(
        () => {
          const width = document.body.clientWidth - leftRightMargin;
          const height = document.body.clientHeight - topMargin;
          setViewWidth(width);
          setViewHeight(height);
          editor.viewportManager.setViewport({
            width,
            height,
          });
          editor.render();
        },
        10,
        { leading: false },
      );
      window.addEventListener('resize', changeViewport);
      setEditor(editor);

      return () => {
        editor.destroy();
        window.removeEventListener('resize', changeViewport);
        changeViewport.cancel();
        if (suikaBinding) {
          suikaBinding.destroy();
        }
      };
    }
  }, [containerRef]);

  return (
    <div>
      <EditorContext.Provider value={editor}>
        <Header />
        {/* body */}
        <div className="body">
          <LayerPanel />
          <div
            ref={containerRef}
            style={{
              position: 'absolute',
              left: 240,
              top: 0,
            }}
          />
          <MultiCursorsView
            style={{
              width: viewWidth,
              height: viewHeight,
            }}
            users={users}
            awarenessClientId={awarenessClientId}
          />
          <InfoPanel />
          <ContextMenu />
        </div>
      </EditorContext.Provider>
    </div>
  );
};

export default Editor;
