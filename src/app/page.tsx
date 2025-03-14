/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ErrorBoundary,
  TestButtonMultipart,
  TestButtonPlaintext,
} from "./form";

export default function Home() {
  return (
    <main style={{ maxWidth: "80ch" }}>
      <section>
        <h1>bodySizeLimit test</h1>
        <p>
          <code>bodySizeLimit</code> is set to: 1.5MB
          <br />
          (but the same thing would happen if removed the setting, the default
          limit is 1MB)
          <br />
          <br />
          the "multipart/form-data" variant somewhat works, but acts strange:
          <br />
          <br />
          - in `next start`, the request is aborted almost immediately. on the
          server, side, we'll log an error about the size limit being exceeded.
          <br />
          <br />
          - when deployed, the request will hang and error after a while, and
          respond with something weird (after what seems to be a timeout
          somewhere). on the server, side, we'll log an error about the size
          limit being exceeded.
          <br />
          <br />
          <br />
          the "text/plain" variant will <strong>not</strong> apply the size
          limit, and will happily execute the action
          <br />
          <br />
          (they're different cases because react encodes action data differently
          depending on how complicated it is, a string is simple so it just gets
          sent as plaintext)
        </p>
      </section>
      <hr />
      <section>
        <h2>content-type: multipart/form-data</h2>
        <ErrorBoundary>
          <TestButtonMultipart
            action={async (_state) => {
              "use server";
              console.log("hello from multipart action");
              return `action result ${Date.now()}`;
            }}
          />
        </ErrorBoundary>
      </section>
      <section>
        <h2>content-type: text/plain</h2>
        <ErrorBoundary>
          <TestButtonPlaintext
            action={async (_state) => {
              "use server";
              console.log("hello from plaintext action");
              return `action result ${Date.now()}`;
            }}
          />
        </ErrorBoundary>
      </section>
    </main>
  );
}
