import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/app_state.dart';
import '../localization.dart';

class AccountScreen extends StatelessWidget {
  const AccountScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    return Consumer<AppState>(builder: (context, state, child) {
      if (state.user == null) {
        return Center(
          child: ElevatedButton(
            onPressed: () => state.signIn(),
            child: Text(loc.signInGoogle),
          ),
        );
      }
      return ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('${loc.loggedInAs} ${state.user!.email}'),
          ElevatedButton(onPressed: () => state.signOut(), child: Text(loc.signOut)),
        ],
      );
    });
  }
}
