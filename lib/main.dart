import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';

import 'services/app_state.dart';
import 'screens/home_screen.dart';
import 'screens/fridge_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/account_screen.dart';
import 'screens/add_item_flow.dart';
import 'screens/onboarding_screen.dart';
import 'localization.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp();
  } catch (_) {
    // Continue without Firebase if configuration is missing
  }
  runApp(const MuffaApp());
}

class MuffaApp extends StatelessWidget {
  const MuffaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AppState(),
      child: Consumer<AppState>(
        builder: (context, state, child) {
          return MaterialApp(
            title: 'Muffa',
            locale: state.locale,
            supportedLocales: const [Locale('en'), Locale('it')],
            localizationsDelegates: const [
              AppLocalizationsDelegate(),
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
            ],
            theme: ThemeData(primarySwatch: Colors.green),
            home: state.username.isEmpty ? const OnboardingScreen() : const MainScaffold(),
          );
        },
      ),
    );
  }
}

class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int index = 0;

  final List<Widget> pages = const [
    HomeScreen(),
    FridgeScreen(),
    SizedBox.shrink(),
    SettingsScreen(),
    AccountScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: pages[index],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: index,
        onTap: (i) {
          if (i == 2) return; // center FAB
          setState(() {
            index = i;
          });
        },
        items: [
          BottomNavigationBarItem(icon: const Icon(Icons.home), label: AppLocalizations.of(context).home),
          BottomNavigationBarItem(icon: const Icon(Icons.kitchen), label: AppLocalizations.of(context).fridge),
          const BottomNavigationBarItem(icon: Icon(Icons.add), label: ''),
          BottomNavigationBarItem(icon: const Icon(Icons.settings), label: AppLocalizations.of(context).settings),
          BottomNavigationBarItem(icon: const Icon(Icons.person), label: AppLocalizations.of(context).account),
        ],
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: FloatingActionButton(
        onPressed: () => AddItemFlow.start(context),
        child: const Icon(Icons.add),
      ),
    );
  }
}
