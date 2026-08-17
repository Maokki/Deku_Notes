const APP_VARIANT = process.env.APP_VARIANT || "production";

const VARIANT_CONFIG = {
  development: {
    name: "Deku Notes (Dev)",
    iosBundleIdentifier: "com.nagiiiqt.DekuNotes.dev",
    androidPackage: "com.nagiiiqt.DekuNotes.dev",
  },
  preview: {
    name: "Deku Notes",
    iosBundleIdentifier: "com.nagiiiqt.DekuNotes",
    androidPackage: "com.nagiiiqt.DekuNotes",
  },
  production: {
    name: "Deku Notes",
    iosBundleIdentifier: "com.nagiiiqt.DekuNotes",
    androidPackage: "com.nagiiiqt.DekuNotes",
  },
};

const variant = VARIANT_CONFIG[APP_VARIANT];

export default {
  expo: {
    scheme: "deku-notes",
    name: variant.name,
    slug: "MaoMao-Notes",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/deku_note.png",
    userInterfaceStyle: "light",
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIStatusBarHidden: true,
        ITSAppUsesNonExemptEncryption: false,
      },
      bundleIdentifier: variant.iosBundleIdentifier,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/deku_note.png",
        backgroundColor: "#ffffff",
      },
      package: variant.androidPackage,
    },
    web: {
      favicon: "./assets/deku_note.png",
    },
    plugins: ["expo-router", "expo-sharing", "expo-font"],
    extra: {
      router: {},
      eas: {
        projectId: "2bdbdb75-e635-4abd-9c3d-7323b1a4d8e2",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/2bdbdb75-e635-4abd-9c3d-7323b1a4d8e2",
    },
  },
};