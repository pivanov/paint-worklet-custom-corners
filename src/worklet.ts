interface PaintSize {
  width: number;
  height: number;
}

class InvertedCornersPainter {
  // Define the input properties this paint worklet accepts
  static get inputProperties(): string[] {
    return [
      '--corner-radius',
      '--background-color',
      '--background-gradient',
    ];
  }

  /**
   * Parses the custom properties for corner radii, background color, and gradient.
   * Handles shorthand notations for corner radii and optional gradient properties.
   *
   * @param {StylePropertyMapReadOnly} properties - CSS properties passed to the paint function.
   * @returns {Object} Parsed values for corner radii, gradient angle, and colors.
   */
  _parseProperties(properties: StylePropertyMapReadOnly): { radii: number[], angle: number, colors: string[] } {
    // Parse the corner radius values, split by space, and convert to floats
    const radii = properties.get('--corner-radius')?.toString().trim().split(' ').map(parseFloat) || [0];

    // Get the solid background color
    const backgroundColor = properties.get('--background-color')?.toString().trim() || '#fff';

    // Get the background gradient (if any)
    const backgroundGradient = properties.get('--background-gradient')?.toString().trim() || '';

    let angle = 0; // Default angle for gradients
    let colors = [backgroundColor]; // Default to the background color

    if (backgroundGradient) {
      // Split gradient string into its components (angle or colors)
      colors = backgroundGradient.split(',').map(color => color.trim());

      // Check if the first component is an angle in degrees
      if (colors[0].includes('deg')) {
        angle = parseFloat(colors[0].replace('deg', '')) || 0;
        colors.shift(); // Remove the angle from the color list
      }
    }

    // Convert the angle to radians for canvas usage
    angle = angle * Math.PI / 180;

    return { radii, angle, colors };
  }

  /**
   * Get the radii for each corner, considering shorthand notations.
   * Supports 1 to 4 values for radii, mapping them to the correct corners.
   *
   * @param {number[]} radii - Array of parsed corner radii.
   * @returns {number[]} Array of four radii for each corner (top-left, top-right, bottom-right, bottom-left).
   */
  _getRadii(radii: number[]): number[] {
    const [a = 0, b = 0, c = 0, d = 0] = radii;

    switch (radii.length) {
      case 1: return [a, a, a, a];
      case 2: return [a, b, a, b];
      case 3: return [a, b, c, b];
      default: return [a, b, c, d];
    }
  }

  /**
   * Determines whether a given radius value should invert the corner.
   *
   * @param {number} radius - Radius value for the corner.
   * @returns {boolean} Whether the corner is inverted (negative radius).
   */
  _isInverted(radius: number): boolean {
    return radius < 0;
  }

  /**
   * Draws a linear gradient on the canvas based on the specified angle and colors.
   *
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   * @param {PaintSize} geom - Geometry of the area to be painted.
   * @param {number} angle - Angle of the gradient in radians.
   * @param {string[]} colors - Array of colors used in the gradient.
   */
  _drawGradient(ctx: CanvasRenderingContext2D, geom: PaintSize, angle: number, colors: string[]): void {
    // Check if we have a gradient background specified
    if (colors.length >= 1) {
      // Calculate the gradient length to fit diagonal
      const gradLength = Math.sqrt(geom.width ** 2 + geom.height ** 2) / 2;

      const x1 = geom.width / 2 - Math.cos(angle) * gradLength;
      const y1 = geom.height / 2 - Math.sin(angle) * gradLength;
      const x2 = geom.width / 2 + Math.cos(angle) * gradLength;
      const y2 = geom.height / 2 + Math.sin(angle) * gradLength;

      // Calculate the color stops step
      const step = 1 / (colors.length - 1);

      // Create the linear gradient
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);

      for (let i = 0; i < colors.length; i += 1) {
        // Input properties are given in `<color> <colorStop>` format
        const [color, colorStop] = colors[i].split(' ');

        // Default offset to equally distributed color stops
        let offset = i === colors.length - 1 ? 1 : i * step;

        if (colorStop) {
          // Override with custom color stop, if specified
          offset = parseFloat(colorStop);
        }

        grad.addColorStop(offset, color);
      }

      ctx.fillStyle = grad;
    }
  }

  /**
   * Draws the shape with rounded or inverted corners on the canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   * @param {PaintSize} geom - Geometry of the area to be painted.
   * @param {number[]} radii - Array of four radii for the corners.
   */
  _drawShape(ctx: CanvasRenderingContext2D, geom: PaintSize, radii: number[]): void {
    const [topLeft, topRight, bottomRight, bottomLeft] = this._getRadii(radii);

    const maxInvRadius = Math.abs(Math.min(...radii, 0));

    ctx.beginPath();

    if (this._isInverted(topLeft)) {
      ctx.moveTo(maxInvRadius - Math.abs(topLeft), 0);
    } else {
      ctx.moveTo(maxInvRadius + Math.abs(topLeft), 0);
    }

    ctx.quadraticCurveTo(maxInvRadius, 0, maxInvRadius, Math.abs(topLeft));
    ctx.lineTo(maxInvRadius, geom.height - Math.abs(bottomLeft));

    if (this._isInverted(bottomLeft)) {
      ctx.quadraticCurveTo(maxInvRadius, geom.height, maxInvRadius - Math.abs(bottomLeft), geom.height);
    } else {
      ctx.quadraticCurveTo(maxInvRadius, geom.height, maxInvRadius + Math.abs(bottomLeft), geom.height);
    }

    if (this._isInverted(bottomRight)) {
      ctx.lineTo(geom.width - maxInvRadius + Math.abs(bottomRight), geom.height);
    } else {
      ctx.lineTo(geom.width - maxInvRadius - Math.abs(bottomRight), geom.height);
    }

    ctx.quadraticCurveTo(geom.width - maxInvRadius, geom.height, geom.width - maxInvRadius, geom.height - Math.abs(bottomRight));
    ctx.lineTo(geom.width - maxInvRadius, Math.abs(topRight));

    if (this._isInverted(topRight)) {
      ctx.quadraticCurveTo(geom.width - maxInvRadius, 0, geom.width - maxInvRadius + Math.abs(topRight), 0);
    } else {
      ctx.quadraticCurveTo(geom.width - maxInvRadius, 0, geom.width - maxInvRadius - Math.abs(topRight), 0);
    }

    ctx.closePath();
    ctx.fill();
  }

  /**
   * Main paint function called by the browser to render the custom corners.
   *
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   * @param {PaintSize} geom - Geometry of the area to be painted.
   * @param {StylePropertyMapReadOnly} properties - CSS properties passed to the paint function.
   */
  paint(ctx: CanvasRenderingContext2D, geom: PaintSize, properties: StylePropertyMapReadOnly): void {
    const { radii, angle, colors } = this._parseProperties(properties);

    // First draw the gradient background
    this._drawGradient(ctx, geom, angle, colors);

    // Then draw the shape with the rounded or inverted corners
    this._drawShape(ctx, geom, radii);
  }
}

registerPaint('custom-corners', InvertedCornersPainter);
