import './MultiCursorsView.scss';

import { type IPoint } from '@suika/geo';
import {
  type CSSProperties,
  type FC,
  useContext,
  useEffect,
  useState,
} from 'react';

import { EditorContext } from '../../context';
import { type IUserItem } from '../../type';
import { getColorfulCursor } from './utils';

interface IProps {
  style?: CSSProperties;
  users?: IUserItem[];
  awarenessClientId: number;
}

export const MultiCursorsView: FC<IProps> = ({
  style,
  users = [],
  awarenessClientId,
}) => {
  const editor = useContext(EditorContext);

  const toViewportPos = (pos: IPoint) => {
    if (!editor) return null;
    return editor.sceneCoordsToViewport(pos.x, pos.y);
  };

  const [, setViewportId] = useState({}); // to force rerender component

  useEffect(() => {
    if (!editor) return;

    const changeViewportId = () => {
      setViewportId({});
    };

    editor.viewportManager.on('xOrYChange', changeViewportId);
    editor.zoomManager.on('zoomChange', changeViewportId);

    return () => {
      editor.viewportManager.off('xOrYChange', changeViewportId);
      editor.zoomManager.off('zoomChange', changeViewportId);
    };
  }, [editor]);

  return (
    <div
      className="sk-cursors-view"
      style={{ position: 'absolute', left: 240, top: 0, ...style }}
    >
      {users
        .filter((user) => user.pos && user.awarenessId !== awarenessClientId)
        .map((user) => {
          const pos = user.pos ? toViewportPos(user.pos) : null;
          return pos ? (
            <div
              key={user.name}
              style={{
                willChange: 'transform',
                transform: `translate3d(${pos.x}px, ${pos.y}px, 0px)`,
              }}
            >
              <img
                className="sk-multi-cursor-image"
                src={getColorfulCursor(user.color)}
              />
              <div
                className="sk-multi-cursor-username"
                style={{
                  background: user.color,
                }}
              >
                {user.name}
              </div>
            </div>
          ) : null;
        })}
    </div>
  );
};
