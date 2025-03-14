/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";

const ILLEGAL_SIZE_BYTES = 2_000_000;
const BIG_STRING = "a".repeat(ILLEGAL_SIZE_BYTES);

export function TestButtonMultipart({
  action,
}: {
  action: (arg: any) => Promise<any>;
}) {
  // react will encode more complex types (like a `Set`) as form data
  return <TestButtonBase action={() => action(new Set([BIG_STRING]))} />;
}

export function TestButtonPlaintext({
  action,
}: {
  action: (value: any) => Promise<any>;
}) {
  // react will encode simple types (like a `string`) as plaintext (JSON-ish)
  return <TestButtonBase action={() => action(BIG_STRING)} />;
}

export function TestButtonBase({ action }: { action: () => Promise<any> }) {
  // if we errored while submitting, rethrow it during render
  const [state, setState] = useState<RequestState<any> | null>(null);
  if (state?.type === "rejected") {
    throw state.reason;
  }

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          try {
            const result = await action();
            setState({ type: "fulfilled", value: result });
          } catch (err) {
            setState({ type: "rejected", reason: err });
          }
        }}
      >
        submit {BIG_STRING.length / 1_000_000}mb request
      </button>
      {state?.type === "pending" && <> submitting...</>}
      {state?.type === "fulfilled" && <> result: {state.value}</>}
    </div>
  );
}

type RequestState<T> =
  | { type: "pending" }
  | { type: "fulfilled"; value: T }
  | { type: "rejected"; reason: unknown };

export class ErrorBoundary extends React.Component<
  { children?: React.ReactNode },
  { hasError: false } | { hasError: true; error: Error }
> {
  constructor(props: { children?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error;
      return (
        <div style={{ color: "tomato" }}>
          <strong>Something went wrong</strong>
          <br />
          {error.name}: {error.message}
          {error.stack && <div style={{ opacity: 0.75 }}>{error.stack}</div>}
        </div>
      );
    }
    return this.props.children;
  }
}
