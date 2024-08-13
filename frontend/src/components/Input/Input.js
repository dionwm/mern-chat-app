import React from "react";
import "./Input.css";

export default function Input({
  type,
  onChange,
  placeholder,
  className,
  isRequired,
}) {
  return (
    <input
      type={type}
      className={className ? className : undefined}
      placeholder={type !== "file" ? placeholder : undefined}
      onChange={(e) => {
        type !== "file"
          ? onChange(e.target.value)
          : onChange(e.target.files[0]);
      }}
      autoComplete="on"
      accept={type === "file" ? "image/*" : undefined}
      required={isRequired ? true : undefined}
    />
  );
}
