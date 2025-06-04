import 'package:flutter/material.dart';

import '../models/food_item.dart';
import '../localization.dart';

class FoodTile extends StatelessWidget {
  final FoodItem item;

  const FoodTile({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    return ListTile(
      title: Text(item.name),
      subtitle: Text(
        '${loc.expires}: ${item.expirationDate.toLocal().toString().split(' ')[0]}\n${loc.addedBy}: ${item.addedBy}',
      ),
    );
  }
}
