import React from "react";
import "./Input.css";

export default function Input({
  type,
  setState,
  placeholder,
  className,
  isRequired,
}) {
  return (
    <input
      type={type}
      class={className ? className : undefined}
      placeholder={type !== "file" ? placeholder : undefined}
      onChange={(e) => setState(e.target.value)}
      autoComplete="on"
      accept={type === "file" ? "image/*" : undefined}
      required={isRequired ? true : undefined}
    />
  );
}
