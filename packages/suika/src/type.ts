import { type IPoint } from '@suika/geo';

export interface IUserItem {
  name: string;
  color: string;
  pos: IPoint | null;
  awarenessId: number;
}
