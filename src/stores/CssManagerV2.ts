import { makeAutoObservable } from "mobx";
import React from "react";

// Define specific types for different CSS value types
type CSSLengthUnit = "px" | "em" | "rem" | "%" | "vw" | "vh";
type CSSColorValue = string; // This could be more specific if needed
type CSSLengthValue = `${number}${CSSLengthUnit}`;

// Define a type for all possible CSS property values
type CSSPropertyValue =
  | CSSLengthValue
  | CSSColorValue
  | "auto"
  | "inherit"
  | "initial"
  | number;

// Define a more specific type for CSS properties
type CSSProperties = {
  [K in keyof React.CSSProperties]: CSSPropertyValue;
};

class CSSPropsManager {
  private props: Partial<CSSProperties> = {};

  constructor() {
    makeAutoObservable(this);
  }

  setProp<K extends keyof CSSProperties>(key: K, value: CSSProperties[K]) {
    this.props[key] = value;
  }

  getProp<K extends keyof CSSProperties>(key: K): CSSProperties[K] | undefined {
    return this.props[key];
  }

  setProps(props: Partial<CSSProperties>) {
    Object.assign(this.props, props);
  }

  getFull(): Partial<CSSProperties> {
    return { ...this.props };
  }

  getShort(): Partial<CSSProperties> {
    const shortProps: Partial<CSSProperties> = { ...this.props };
    const shorthandProps: Record<string, (keyof CSSProperties)[]> = {
      margin: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
      padding: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
      border: ["borderWidth", "borderStyle", "borderColor"],
      // Add more shorthand properties as needed
    };

    for (const [shorthand, longProps] of Object.entries(shorthandProps)) {
      const values = longProps.map((prop) => this.props[prop]);
      if (values.every((v) => v !== undefined)) {
        shortProps[shorthand as keyof CSSProperties] = values.join(
          " "
        ) as CSSPropertyValue;
        longProps.forEach((prop) => delete shortProps[prop]);
      }
    }

    return shortProps;
  }
}

export default CSSPropsManager;
