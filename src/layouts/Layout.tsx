import Head from "next/head";
import React, { useEffect } from "react";
import Navbar from "~/components/Navbar";
import { useAppDispatch } from "~/hooks/redux";
import {
  modeSchema,
  type Mode,
  reset,
  stateShema,
  mount,
  initialize,
  switchMode,
  addSeed,
} from "~/store/metaSlice";
import {} from "~/store/metaSlice";
import { store } from "~/store/store";
import { Provider } from "react-redux";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   if (typeof window === "undefined" || mounted) {
  //     return;
  //   }
  //   initialization(dispatch);
  //   // mounted
  //   dispatch(mount());
  // }, [dispatch, mounted]);
  // const a = window.localStorage.getItem("mode");
  // console.log(a);
  useEffect(() => {
    initialization(dispatch);
    dispatch(mount());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Rasli</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <Provider store={store}>
      <Layout>{children}</Layout>
    </Provider>
  );
}

function initialization(dispatch: ReturnType<typeof useAppDispatch>) {
  //meta
  initState("comfy", dispatch);
  initState("unlimited", dispatch);
  // Mode
  const modeRaw = localStorage.getItem("mode");
  const parsedMode = modeSchema.safeParse(modeRaw);
  if (parsedMode.success) {
    dispatch(switchMode(parsedMode.data));
  }
  // seed
  const seed = localStorage.getItem("seed") ?? Math.random().toString();
  dispatch(addSeed(seed));
}

function initState(mode: Mode, dispatch: ReturnType<typeof useAppDispatch>) {
  const stateRaw = localStorage.getItem(mode);
  if (stateRaw !== null) {
    const stateJson: unknown = JSON.parse(stateRaw);
    const parsed = stateShema.safeParse(stateJson);
    if (parsed.success) {
      dispatch(initialize({ mode: mode, state: parsed.data }));
    } else {
      dispatch(reset(mode));
    }
  } else {
    dispatch(reset(mode));
  }
}
