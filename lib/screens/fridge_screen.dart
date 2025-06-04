import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/app_state.dart';
import '../widgets/food_tile.dart';

class FridgeScreen extends StatelessWidget {
  const FridgeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, state, child) {
        if (state.gridLayout) {
          return GridView.count(
            crossAxisCount: 2,
            children: state.items.map((e) => FoodTile(item: e)).toList(),
          );
        }
        return ListView(
          children: state.items.map((e) => FoodTile(item: e)).toList(),
        );
      },
    );
  }
}
