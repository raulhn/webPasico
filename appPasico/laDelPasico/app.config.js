export default {
	  "expo": {
    "name": "laDelPasico",
    "slug": "laDelPasico",
    "version": "1.0.0",
    "scheme": "laDelPasico",
    "orientation": "portrait",
    "icon": "./assets/logo.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    }, 
    "android": {
      "googleServicesFile":  process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
      "package": "com.ladelpasico.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-secure-store"
    ],
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "10a7fcf1-01cb-4d13-b0a7-0bcd9e9b2aae"
      }
    }
  }
};
