import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/app_state.dart';
import '../localization.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, state, child) {
        final loc = AppLocalizations.of(context);
        return ListView(
          padding: const EdgeInsets.all(16),
          children: [
            DropdownButton<Locale>(
              value: state.locale,
              onChanged: (val) {
                if (val != null) {
                  state.setLocale(val);
                }
              },
              items: const [
                DropdownMenuItem(value: Locale('en'), child: Text('English')),
                DropdownMenuItem(value: Locale('it'), child: Text('Italian')),
              ],
            ),
            SwitchListTile(
              title: Text(loc.gridLayout),
              value: state.gridLayout,
              onChanged: (val) {
                state.setGridLayout(val);
              },
            ),
            ListTile(
              title: Text(loc.expirationFilter),
              trailing: Text(state.filterDays.toString()),
              onTap: () async {
                final controller = TextEditingController(text: state.filterDays.toString());
                final result = await showDialog<String>(
                    context: context,
                    builder: (context) {
                      return AlertDialog(
                        title: Text(loc.setFilterDays),
                        content: TextField(controller: controller, keyboardType: TextInputType.number),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(context), child: Text(loc.cancel)),
                          TextButton(onPressed: () => Navigator.pop(context, controller.text), child: Text(loc.ok)),
                        ],
                      );
                    });
                if (result != null) {
                  state.setFilterDays(int.tryParse(result) ?? state.filterDays);
                }
              },
            ),
            ListTile(
              title: Text(loc.fridgeId),
              subtitle: Text(state.fridgeId ?? 'Not set'),
              onTap: () async {
                final controller = TextEditingController(text: state.fridgeId);
                final result = await showDialog<String>(
                    context: context,
                    builder: (context) {
                      return AlertDialog(
                        title: Text(loc.setFridgeId),
                        content: TextField(controller: controller),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(context), child: Text(loc.cancel)),
                          TextButton(onPressed: () => Navigator.pop(context, controller.text), child: Text(loc.ok)),
                        ],
                      );
                    });
                if (result != null) {
                  state.setFridgeId(result);
                }
              },
            ),
          ],
        );
      },
    );
  }
}
