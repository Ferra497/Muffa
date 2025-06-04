# Muffa

Muffa is a small Flutter application for managing shared fridge items.
The app mirrors the design and functionality of the original example web
implementation.

## Features
- Bottom navigation with Home, Fridge, Add, Settings, and Account screens
- Add items via the camera or gallery and detect food names (placeholder)
- Items stored in Firestore when logged in or locally when offline
- Filter items by expiration date on the Home screen
- Switch language, change layout, set filter days, and manage the fridge ID
- Google sign-in using Firebase Auth

## Setup
1. Install [Flutter](https://flutter.dev) 3.10 or newer.
2. Clone this repository and run `flutter pub get`.
3. Create a Firebase project and copy the configuration files
   (`google-services.json`/`GoogleService-Info.plist`).
4. Place your Firebase credentials in `android/app` and `ios/Runner` as usual.
5. Run the app with `flutter run`.

When Firebase is not configured or you skip sign-in, data is saved locally using
`SharedPreferences`.

## License
This project is released under the MIT License. See [LICENSE](LICENSE) for
details.
