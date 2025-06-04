import 'package:flutter/material.dart';

class AppLocalizations {
  AppLocalizations(this.locale);

  final Locale locale;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const _localizedStrings = {
    'en': {
      'home': 'Home',
      'fridge': 'Fridge',
      'settings': 'Settings',
      'account': 'Account',
      'take_photo': 'Take photo',
      'choose_photo': 'Choose from gallery',
      'sign_in_google': 'Sign in with Google',
      'sign_out': 'Sign out',
      'logged_in_as': 'Logged in as',
      'grid_layout': 'Grid layout',
      'expiration_filter': 'Expiration filter days',
      'expires': 'Expires',
      'added_by': 'Added by',
      'set_filter_days': 'Set filter days',
      'fridge_id': 'Fridge ID',
      'set_fridge_id': 'Set fridge ID',
      'cancel': 'Cancel',
      'ok': 'OK',
      'skip': 'Skip',
      'username_prompt': 'Enter username',
      'login_or_skip': 'Log in or continue without account',
      'login': 'Log in',
    },
    'it': {
      'home': 'Home',
      'fridge': 'Frigo',
      'settings': 'Impostazioni',
      'account': 'Account',
      'take_photo': 'Scatta foto',
      'choose_photo': 'Scegli dalla galleria',
      'sign_in_google': 'Accedi con Google',
      'sign_out': 'Disconnetti',
      'logged_in_as': 'Accesso come',
      'grid_layout': 'Griglia',
      'expiration_filter': 'Filtro giorni scadenza',
      'expires': 'Scade',
      'added_by': 'Aggiunto da',
      'set_filter_days': 'Imposta giorni filtro',
      'fridge_id': 'ID frigo',
      'set_fridge_id': 'Imposta ID frigo',
      'cancel': 'Annulla',
      'ok': 'OK',
      'skip': 'Salta',
      'username_prompt': 'Inserisci nome utente',
      'login_or_skip': 'Accedi o continua senza account',
      'login': 'Accedi',
    },
  };

  String _translate(String key) {
    return _localizedStrings[locale.languageCode]?[key] ??
        _localizedStrings['en']![key]!;
  }

  String get home => _translate('home');
  String get fridge => _translate('fridge');
  String get settings => _translate('settings');
  String get account => _translate('account');
  String get takePhoto => _translate('take_photo');
  String get choosePhoto => _translate('choose_photo');
  String get signInGoogle => _translate('sign_in_google');
  String get signOut => _translate('sign_out');
  String get loggedInAs => _translate('logged_in_as');
  String get gridLayout => _translate('grid_layout');
  String get expirationFilter => _translate('expiration_filter');
  String get expires => _translate('expires');
  String get addedBy => _translate('added_by');
  String get setFilterDays => _translate('set_filter_days');
  String get fridgeId => _translate('fridge_id');
  String get setFridgeId => _translate('set_fridge_id');
  String get cancel => _translate('cancel');
  String get ok => _translate('ok');
  String get skip => _translate('skip');
  String get usernamePrompt => _translate('username_prompt');
  String get loginOrSkip => _translate('login_or_skip');
  String get login => _translate('login');
}

class AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => ['en', 'it'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(LocalizationsDelegate<AppLocalizations> old) => false;
}
