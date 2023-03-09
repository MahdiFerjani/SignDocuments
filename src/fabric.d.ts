declare module 'fabric' {
  export const version: string;

  export class Object {
    constructor(options?: any);
  }

  export class Canvas {
    constructor(element: HTMLCanvasElement, options?: any);
    // Add other Canvas methods and properties here as needed
  }

  // Add other Fabric.js classes, interfaces, and types here as needed
}