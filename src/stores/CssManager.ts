import { makeAutoObservable } from "mobx";
import { CSSProperties } from "react";
// https://claude.ai/chat/b2ea18e1-d9a5-4ffb-85c5-3879a3295655
class CssManager {
  private properties: Map<keyof CSSStyleDeclaration, string>;

  constructor() {
    this.properties = new Map<keyof CSSStyleDeclaration, string>();
    makeAutoObservable(this);
  }

  // Action to set a CSS property with type safety
  setProperty(property: keyof CSSStyleDeclaration, value: string) {
    this.properties.set(property, value);
  }

  // Enhanced getProperty method
  getProperty(property: keyof CSSStyleDeclaration): string | undefined {
    if (this.properties.has(property)) {
      return this.properties.get(property);
    }

    // Handle shorthand properties by calculating them
    if (property === "padding") {
      return this.calculateShorthand("padding");
    } else if (property === "margin") {
      return this.calculateShorthand("margin");
    } else if (property === "border") {
      return this.calculateShorthand("border");
    }

    return undefined;
  }

  // Method to calculate shorthand property values
  private calculateShorthand(propertyType: string): string | undefined {
    const sides = ["Top", "Right", "Bottom", "Left"];
    const values: string[] = [];

    sides.forEach((side) => {
      const value = this.properties.get(
        `${propertyType}${side}` as keyof CSSStyleDeclaration
      );
      values.push(value || "0px");
    });

    return this.generateShorthandValue(values);
  }

  // Convert the Map to a CSSProperties object with compatible types
  private convertToCSSProperties(
    properties: Map<keyof CSSStyleDeclaration, string>
  ): CSSProperties {
    const styleObject: Record<string, string> = {};

    properties.forEach((value, key) => {
      if (typeof key === "string" && value !== undefined) {
        styleObject[key] = value;
      }
    });

    return styleObject as CSSProperties;
  }

  // Generate the shorthand value from the values array
  private generateShorthandValue(values: string[]): string | undefined {
    const [top, right, bottom, left] = values;

    if (top === right && top === bottom && top === left) {
      return top; // e.g., "10px"
    } else if (top === bottom && right === left) {
      return `${top} ${right}`; // e.g., "10px 20px"
    } else if (right === left) {
      return `${top} ${right} ${bottom}`; // e.g., "10px 20px 30px"
    } else {
      return `${top} ${right} ${bottom} ${left}`; // e.g., "10px 20px 30px 40px"
    }
  }

  // Method to get the full individual CSS properties
  getFull(): CSSProperties {
    const fullProperties = new Map(this.properties); // Clone the current properties map

    // Expand all shorthand properties into their full forms
    this.expandMarginShorthand(fullProperties);
    this.expandPaddingShorthand(fullProperties);
    this.expandBorderShorthand(fullProperties);

    return this.convertToCSSProperties(fullProperties);
  }

  // Expand margin shorthand to individual properties
  private expandMarginShorthand(
    properties: Map<keyof CSSStyleDeclaration, string>
  ) {
    const margin = properties.get("margin");
    if (margin) {
      const values = margin.split(" ");
      properties.set("marginTop", values[0]);
      properties.set("marginRight", values[1] || values[0]);
      properties.set("marginBottom", values[2] || values[0]);
      properties.set("marginLeft", values[3] || values[1] || values[0]);
      properties.delete("margin");
    }
  }

  // Expand padding shorthand to individual properties
  private expandPaddingShorthand(
    properties: Map<keyof CSSStyleDeclaration, string>
  ) {
    const padding = properties.get("padding");
    if (padding) {
      const values = padding.split(" ");
      properties.set("paddingTop", values[0]);
      properties.set("paddingRight", values[1] || values[0]);
      properties.set("paddingBottom", values[2] || values[0]);
      properties.set("paddingLeft", values[3] || values[1] || values[0]);
      properties.delete("padding");
    }
  }

  // Expand border shorthand to individual properties
  private expandBorderShorthand(
    properties: Map<keyof CSSStyleDeclaration, string>
  ) {
    const border = properties.get("border");
    if (border) {
      const [width, style, color] = border.split(" ");
      properties.set("borderTopWidth", width || "medium");
      properties.set("borderRightWidth", width || "medium");
      properties.set("borderBottomWidth", width || "medium");
      properties.set("borderLeftWidth", width || "medium");

      properties.set("borderTopStyle", style || "none");
      properties.set("borderRightStyle", style || "none");
      properties.set("borderBottomStyle", style || "none");
      properties.set("borderLeftStyle", style || "none");

      properties.set("borderTopColor", color || "black");
      properties.set("borderRightColor", color || "black");
      properties.set("borderBottomColor", color || "black");
      properties.set("borderLeftColor", color || "black");

      properties.delete("border");
    }
  }

  // Apply shorthand for margin, padding, and border
  private applyShorthand(
    propertyType: string,
    properties: Map<keyof CSSStyleDeclaration, string>
  ) {
    const sides = ["Top", "Right", "Bottom", "Left"];
    const values: string[] = [];

    let allSidesExist = true;
    sides.forEach((side) => {
      const value = properties.get(
        `${propertyType}${side}` as keyof CSSStyleDeclaration
      );
      if (value !== undefined) {
        values.push(value);
      } else {
        allSidesExist = false;
        values.push(""); // Placeholder for missing value
      }
    });

    if (allSidesExist) {
      const shorthandValue = this.generateShorthandValue(values);
      if (shorthandValue) {
        properties.set(
          propertyType as keyof CSSStyleDeclaration,
          shorthandValue
        );
        sides.forEach((side) => {
          properties.delete(
            `${propertyType}${side}` as keyof CSSStyleDeclaration
          );
        });
      }
    }
  }
}

export default CssManager;
