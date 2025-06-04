import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/app_state.dart';
import '../widgets/food_tile.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, state, child) {
        final now = DateTime.now();
        final upcoming = state.items.where((item) => item.expirationDate.difference(now).inDays <= state.filterDays).toList();
        if (state.gridLayout) {
          return GridView.count(
            crossAxisCount: 2,
            children: upcoming.map((e) => FoodTile(item: e)).toList(),
          );
        }
        return ListView(
          children: upcoming.map((e) => FoodTile(item: e)).toList(),
        );
      },
    );
  }
}
