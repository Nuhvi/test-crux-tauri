import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

import {
  ScreenVariantRed,
  type ViewModel,
} from "shared_types/types/shared_types.ts";

const initialState: ViewModel = {
  screen: new ScreenVariantRed(), // ??
  serialize: () => { }
};

function App() {
  const [view, setView] = useState(initialState);

  useEffect(
    () => {
      invoke("watch");
    },
    /*once*/[]
  );

  useEffect(() => {
    let unlistenToRender: UnlistenFn;

    listen<ViewModel>("render", (event) => {
      setView(event.payload);
    }).then((unlisten) => {
      unlistenToRender = unlisten;
    });

    return () => {
      unlistenToRender?.();
    };
  });

  return (
    <main>
      <section className="section has-text-centered">
        <p className="title">Crux Counter Example</p>
        <p className="is-size-5">Rust Core, Rust Shell (Tauri + React.js)</p>
      </section>
      <section className="container has-text-centered">
        <div className="buttons section is-centered">
          <button
            className="button is-primary is-warning"
            onClick={() => {
              invoke("decrement");
            }}
          >
            {"Decrement"}
          </button>
          {
            (() => {
              if (view.screen instanceof ScreenVariantRed) {
                return "Red"
              } else {
                return "Black"
              }
            })()
          }
          <button
            className="button is-primary is-danger"
            onClick={() => {
              invoke("increment");
            }}
          >
            {"Increment"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
