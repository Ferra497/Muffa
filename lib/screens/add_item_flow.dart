import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../models/food_item.dart';
import '../services/app_state.dart';
import '../services/data_service.dart';
import '../services/image_recognition.dart';
import '../localization.dart';

class AddItemFlow {
  static Future<void> start(BuildContext context) async {
    final picker = ImagePicker();
    final loc = AppLocalizations.of(context);
    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      builder: (context) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            leading: const Icon(Icons.photo_camera),
            title: Text(loc.takePhoto),
            onTap: () => Navigator.pop(context, ImageSource.camera),
          ),
          ListTile(
            leading: const Icon(Icons.photo_library),
            title: Text(loc.choosePhoto),
            onTap: () => Navigator.pop(context, ImageSource.gallery),
          ),
        ],
      ),
    );
    if (source == null) return;
    final picked = await picker.pickImage(source: source);
    if (picked == null) return;
    final foods = await recognizeFoodFromImage(picked);
    final state = context.read<AppState>();
    for (final food in foods) {
      final dateStr = await showDialog<String>(
        context: context,
        builder: (context) {
          final controller = TextEditingController();
          return AlertDialog(
            title: Text('Expiration date for $food'),
            content: TextField(
              controller: controller,
              decoration: const InputDecoration(hintText: 'YYYY-MM-DD'),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(context), child: Text(loc.skip)),
              TextButton(onPressed: () => Navigator.pop(context, controller.text), child: Text(loc.ok)),
            ],
          );
        },
      );
      final date = dateStr != null && dateStr.isNotEmpty ? DateTime.tryParse(dateStr) ?? DateTime(2099, 12, 31) : DateTime(2099, 12, 31);
      final item = FoodItem(
        id: DataService(fridgeId: state.fridgeId, loggedIn: state.user != null).generateId(),
        name: food,
        expirationDate: date,
        addedBy: state.username,
        createdAt: DateTime.now(),
      );
      await state.addItem(item);
    }
  }
}
