import { parseRGBAStr } from '@suika/common';
import { IPoint } from '@suika/geo';

import { ImgManager } from '../Img_manager';
import { TextureType } from '../texture';
import { GraphType } from '../type';
import { rotateInCanvas } from '../utils';
import { Graph, GraphAttrs } from './graph';

interface ISegment {
  point: IPoint;
  /**
   * Save the coordinates relative to point
   */
  handleIn?: IPoint;
  handleOut?: IPoint;
}

export interface RectAttrs extends GraphAttrs {
  paths?: ISegment[][];
}

export class Path extends Graph {
  private paths: ISegment[][];

  constructor(options: RectAttrs) {
    super({ ...options, type: GraphType.Path });
    this.paths = options.paths ?? [];
  }

  draw(
    ctx: CanvasRenderingContext2D,
    imgManager?: ImgManager | undefined,
    smooth?: boolean | undefined,
  ) {
    if (this.rotation) {
      const cx = this.x + this.width / 2;
      const cy = this.y + this.height / 2;

      rotateInCanvas(ctx, this.rotation, cx, cy);
    }

    ctx.beginPath();
    for (const path of this.paths) {
      const first = path[0];
      ctx.moveTo(first.point.x, first.point.y);
      for (const segment of path) {
        const pointX = segment.point.x;
        const pointY = segment.point.y;
        if (!segment.handleIn && !segment.handleOut) {
          ctx.lineTo(pointX, pointY);
        } else {
          const handleInX = pointX + (segment.handleIn?.x ?? 0);
          const handleInY = pointY + (segment.handleIn?.y ?? 0);
          const handleOutX = pointX + (segment.handleOut?.x ?? 0);
          const handleOutY = pointY + (segment.handleOut?.y ?? 0);
          ctx.bezierCurveTo(
            handleInX,
            handleInY,
            handleOutX,
            handleOutY,
            pointX,
            pointY,
          );
        }
      }
    }

    for (const texture of this.fill) {
      switch (texture.type) {
        case TextureType.Solid: {
          ctx.fillStyle = parseRGBAStr(texture.attrs);
          ctx.fill();
          break;
        }
        case TextureType.Image: {
          if (imgManager) {
            this.fillImage(ctx, texture, imgManager, smooth);
          } else {
            console.warn('ImgManager is not provided');
          }
        }
      }
    }
    if (this.strokeWidth) {
      ctx.lineWidth = this.strokeWidth;
      for (const texture of this.stroke) {
        switch (texture.type) {
          case TextureType.Solid: {
            ctx.strokeStyle = parseRGBAStr(texture.attrs);
            ctx.stroke();
            break;
          }
          case TextureType.Image: {
            // TODO: stroke image
          }
        }
      }
    }
    ctx.closePath();
  }
}
