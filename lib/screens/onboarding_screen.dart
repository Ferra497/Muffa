import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../localization.dart';
import '../services/app_state.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _fridgeController = TextEditingController();

  @override
  void dispose() {
    _usernameController.dispose();
    _fridgeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(title: Text(loc.loginOrSkip)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Consumer<AppState>(builder: (context, state, child) {
          return Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                onPressed: () async {
                  await state.signIn();
                },
                child: Text(loc.login),
              ),
              TextButton(
                onPressed: () async {
                  await state.signOut();
                },
                child: Text(loc.skip),
              ),
              const SizedBox(height: 24),
              TextField(
                controller: _usernameController,
                decoration: InputDecoration(labelText: loc.usernamePrompt),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _fridgeController,
                decoration: InputDecoration(labelText: loc.fridgeId),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  state.setUsername(_usernameController.text);
                  if (_fridgeController.text.isNotEmpty) {
                    state.setFridgeId(_fridgeController.text);
                  }
                },
                child: Text(loc.ok),
              ),
            ],
          );
        }),
      ),
    );
  }
}