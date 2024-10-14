import { TestBed } from '@angular/core/testing';
import { TProgressService } from './t-progress.service';
import { Theme, Size } from '../../types/theme';

describe('TProgressService', () => {
  let service: TProgressService;
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TProgressService],
    });
    service = TestBed.inject(TProgressService);

    mockCanvas = document.createElement('canvas');
    mockContext = mockCanvas.getContext('2d') as CanvasRenderingContext2D;

    spyOn(mockContext, 'clearRect').and.callThrough();
    spyOn(mockContext, 'beginPath').and.callThrough();
    spyOn(mockContext, 'arc').and.callThrough();
    spyOn(mockContext, 'stroke').and.callThrough();
    spyOn(mockContext, 'fillText').and.callThrough();

    spyOnProperty(mockContext, 'fillStyle', 'set').and.callThrough();
    spyOnProperty(mockContext, 'strokeStyle', 'set').and.callThrough();
    spyOnProperty(mockContext, 'font', 'set').and.callThrough();
    spyOnProperty(mockContext, 'textAlign', 'set').and.callThrough();
    spyOnProperty(mockContext, 'textBaseline', 'set').and.callThrough();

    spyOn(mockCanvas, 'getContext').and.returnValue(mockContext);
  });

  afterEach(() => {
    service.destroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialize', () => {
    it('should initialize canvas and draw background', () => {
      const radius = 100;
      const color = '#ff0000';
      const theme: Theme = 'light';
      const size: Size = 'medium';

      service.initialize(mockCanvas, radius, color, theme, size);

      expect(service['canvas']).toBe(mockCanvas);
      expect(service['context']).toBe(mockContext);
      expect(service['radius']).toBe(radius);
      expect(service['color']).toBe(color);
      expect(service['theme']).toBe(theme);
      expect(service['size']).toBe(size);

      expect(mockCanvas.width).toBe(radius * 2);
      expect(mockCanvas.height).toBe(radius * 2);

      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, radius * 2, radius * 2);
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalledWith(radius, radius, radius - 10, 0, 2 * Math.PI);
      expect(mockContext.strokeStyle).toBe('rgba(0, 0, 0, 0.1)');
      expect(mockContext.lineWidth).toBe(10);
      expect(mockContext.stroke).toHaveBeenCalled();
    });

    it('should set correct background stroke color for dark theme', () => {
      const radius = 100;
      const color = '#ff0000';
      const theme: Theme = 'dark';
      const size: Size = 'medium';

      service.initialize(mockCanvas, radius, color, theme, size);

      expect(mockContext.strokeStyle).toBe('rgba(255, 255, 255, 0.2)');
    });
  });

  describe('setAnimationDuration', () => {
    it('should set the animation duration', () => {
      const duration = 5000;
      service.setAnimationDuration(duration);
      expect((service as TProgressService).duration).toBe(duration);
    });
  });

  describe('drawBackground', () => {
    it('should draw the background circle correctly for light theme', () => {
      service['theme'] = 'light';
      service['radius'] = 100;
      service['context'] = mockContext;

      service.drawBackground();

      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 200, 200);
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalledWith(100, 100, 90, 0, 2 * Math.PI);
      expect(mockContext.strokeStyle).toBe('rgba(0, 0, 0, 0.1)');
      expect(mockContext.lineWidth).toBe(10);
      expect(mockContext.stroke).toHaveBeenCalled();
    });

    it('should draw the background circle correctly for dark theme', () => {
      service['theme'] = 'dark';
      service['radius'] = 100;
      service['context'] = mockContext;

      service.drawBackground();

      expect(mockContext.strokeStyle).toBe('rgba(255, 255, 255, 0.2)');
    });
  });

  describe('destroy', () => {
    it('should cancel any ongoing animation', () => {
      service['animationId'] = 123;
      spyOn(window, 'cancelAnimationFrame');

      service.destroy();

      expect(window.cancelAnimationFrame).toHaveBeenCalledWith(123);
    });
  });

  describe('drawProgressCircle', () => {
    it('should draw the progress circle and text correctly', () => {
      const radius = 100;
      const color = '#00ff00';
      const theme: Theme = 'light';
      const size: Size = 'medium';

      service.initialize(mockCanvas, radius, color, theme, size);

      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 200, 200);
      expect(mockContext.beginPath).toHaveBeenCalledTimes(1); 
      expect(mockContext.strokeStyle).toBe('rgba(0, 0, 0, 0.1)');
      expect(mockContext.lineWidth).toBe(10);
      expect(mockContext.stroke).toHaveBeenCalledTimes(1); 
      expect(mockContext.fillStyle).toBe('#000000');
    });
  });

  describe('private methods', () => {
    it('getBackgroundStrokeColor should return correct color based on theme', () => {
      service['theme'] = 'light';
      expect(service['getBackgroundStrokeColor']()).toBe('rgba(0, 0, 0, 0.1)');

      service['theme'] = 'dark';
      expect(service['getBackgroundStrokeColor']()).toBe('rgba(255, 255, 255, 0.2)');
    });

    it('getTextColor should return correct color based on theme', () => {
      service['theme'] = 'light';
      expect(service['getTextColor']()).toBe('#000');

      service['theme'] = 'dark';
      expect(service['getTextColor']()).toBe('#fff');
    });

    it('getFontSize should return correct font size based on size', () => {
      service['radius'] = 100;

      service['size'] = 'small';
      expect(service['getFontSize']()).toBe(30);

      service['size'] = 'medium';
      expect(service['getFontSize']()).toBe(40);

      service['size'] = 'large';
      expect(service['getFontSize']()).toBe(50);
    });
  });
});
