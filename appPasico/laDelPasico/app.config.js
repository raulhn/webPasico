export default {
	  "expo": {
    "name": "Banda del Pasico",
    "slug": "laDelPasico",
    "version": "1.0.0",
    "scheme": "laDelPasico",
    "orientation": "portrait",
    "icon": "./assets/logo.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/logo.png",
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
        "foregroundImage": "./assets/logo.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router", 
      "expo-secure-store",
      "expo-notifications",
        {
          "icon": "./assets/logo_notifica.png",
           "color": "#ffffff"
        }
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
