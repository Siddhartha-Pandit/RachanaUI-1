import "./Input.css";

import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;

  textarea?: boolean;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export default function Input({
  label,
  hint,
  error,
  success,

  textarea = false,

  leftIcon,
  rightIcon,

  textareaProps,

  className = "",

  ...props
}: InputProps) {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}

      <div className="input-wrapper">
        {leftIcon && (
          <span className="input-icon input-icon-left">
            {leftIcon}
          </span>
        )}

        {textarea ? (
          <textarea
            className={`
              input
              textarea
              ${leftIcon ? "input-has-left" : ""}
              ${rightIcon ? "input-has-right" : ""}
              ${error ? "input-error" : ""}
              ${success ? "input-success" : ""}
              ${className}
            `}
            {...textareaProps}
          />
        ) : (
          <input
            className={`
              input
              ${leftIcon ? "input-has-left" : ""}
              ${rightIcon ? "input-has-right" : ""}
              ${error ? "input-error" : ""}
              ${success ? "input-success" : ""}
              ${className}
            `}
            {...props}
          />
        )}

        {rightIcon && (
          <span className="input-icon input-icon-right">
            {rightIcon}
          </span>
        )}
      </div>

      {hint && !error && !success && (
        <p className="input-hint">
          {hint}
        </p>
      )}

      {error && (
        <p className="input-error-text">
          {error}
        </p>
      )}

      {success && (
        <p className="input-success-text">
          {success}
        </p>
      )}
    </div>
  );
}